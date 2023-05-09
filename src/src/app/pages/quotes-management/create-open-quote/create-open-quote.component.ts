import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SearchableContactsListComponent } from '../quoting-tool/custom-components/searchable-contacts-list/searchable-contacts-list.component';
import { ContactService } from '../../../services/contact.service';
import { BaseComponent } from '../../base.component';
import { BaseComponentService } from '../../../services/base-component.service';
import { forkJoin } from 'rxjs';
import { FunctionConstants, PERMISSIONS, SmartriseValidators, StorageConstants, URLs } from '../../../_shared/constants';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { SelectHelperService } from '../../../services/select-helper.service';
import { LocationService } from '../../../services/location.service';
import { JobLocationView } from '../../../_shared/models/quotes/quote-view.model';
import { Mapper } from '@nartc/automapper';
import { CreateQuotePayload } from '../../../_shared/models/quotes/create-quote-payload.model';
import { CreateQuoteView } from '../../../_shared/models/quotes/create-quote-view.model';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { trimValidator } from '../../../_shared/validators/trim-validator';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountService } from '../../../services/account.service';
import { tap } from 'rxjs/operators';
import { IUserAccountLookup } from '../../../_shared/models/IUser';
import { SelectAccountComponent } from '../../../@theme/components/select-account/select-account.component';

@Component({
  selector: 'ngx-create-open-quote',
  templateUrl: './create-open-quote.component.html',
  styleUrls: ['./create-open-quote.component.scss'],
  providers: [BsModalService]
})
export class CreateOpenQuoteComponent extends BaseComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
  modalRef: any;
  defaultValue = '';
  isLoading = false;
  quote: any = {};

  jobStatusDataSource = [];
  buildingTypesDataSource = [];
  customerContacts: any[];
  hideErrorsPanel: boolean;
  selectedContact: any;
  disableEmail: boolean = true;
  formSubmitted: boolean;
  countries: any[];
  states: any[];
  modelRef: BsModalRef;
  accounts: IUserAccountLookup[];

  public set accountName(value: string) {
    if (value == null) {
      sessionStorage.removeItem(StorageConstants.CreateQuoteSelectedAccountName);
      return;
    }
    sessionStorage.setItem(StorageConstants.CreateQuoteSelectedAccountName, value);
  }

  public get accountName(): string {
    return sessionStorage.getItem(StorageConstants.CreateQuoteSelectedAccountName);
  }

  set accountId(value: number | null) {
    if (value == null) {
      sessionStorage.removeItem(StorageConstants.CreateQuoteSelectedAccount);
      return;
    }
    sessionStorage.setItem(StorageConstants.CreateQuoteSelectedAccount, value.toString());
  }

  get accountId(): number | null {
    const accountId = sessionStorage.getItem(StorageConstants.CreateQuoteSelectedAccount);
    return +accountId;
  }

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private quotingToolService: QuotingToolService,
    private modalService: BsModalService,
    private contactService: ContactService,
    private selectHelperService: SelectHelperService,
    private locationService: LocationService,
    private miscellaneousService: MiscellaneousService,
    private messageService: MessageService,
    private baseService: BaseComponentService,
    private accountService: AccountService,
    private multiAccountsService: MultiAccountsService) {
    super(baseService);
  }

  ngOnDestroy(): void {
    if (this.modalService.getModalsCount() > 0) {
      this.modalService.hide();
    }
    this.accountId = null;
    this.accountName = null;
  }

  consultantNameRequired(control: AbstractControl) {

    if (!control?.value?.toString()?.trim() && !this.form?.value?.unknownConsultant) {
      return { 'required': true };
    }
    return null;
  }

  async ngOnInit() {
    this._initializeForm();
    this._tryAccessThisPage().then((canAccess: boolean) => {
      if (canAccess) {
        this._initializeLookups();
        this._setAccountName(this.accountName);
      } else {
        this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
      }
    });
  }

  private async _tryAccessThisPage() {

    if (this._accountIdAlreadySelected()) {
      return true;
    }

    if (this.multiAccountsService.hasMultipleAccounts()) {
      await this._loadUserAccounts();
      const authorizedAccounts = this._getAccountsWithSaveOnlineQuotePermission();

      if (authorizedAccounts.length === 1) {
        const account = authorizedAccounts[0];
        this._saveAccountInfoToStorage(account.accountId);
        return true;
      }

      if (authorizedAccounts.length === 0) {
        return false;
      }

      const selectedAccount = await this._promptAccountSelection(authorizedAccounts);
      if (selectedAccount) {
        this._saveAccountInfoToStorage(selectedAccount);
        return true;
      } else {
        return false;
      }
    }

    if (!await this._selectedAccountHasSaveOnlineQuotePermission()) {
      return false;
    }

    this._saveAccountInfoToStorage(this.multiAccountsService.getSelectedAccount());
    return true;
  }

  private _accountIdAlreadySelected() {
    if (sessionStorage.getItem('CreateQuoteSelectedAccount')) {
      return true;
    }
    return false;
  }

  private _promptAccountSelection(authorizedAccounts: IUserAccountLookup[]): Promise<number | null> {
    return new Promise((resolve, reject) => {

      const modelRef = this._showSelectAccountPopup(authorizedAccounts);
      modelRef.onHide.subscribe(() => {
        if (modelRef.content.selectionChangeApplied()) {
          resolve(modelRef.content.selectedAccount);
        } else {
          resolve(null);
        }
      });
    });
  }

  private _showSelectAccountPopup(authorizedAccounts: IUserAccountLookup[]) {
    return this.modalService.show<SelectAccountComponent>(SelectAccountComponent, {
      initialState: {
        hideAllOption: true,
        accounts: authorizedAccounts
      }
    });
  }

  private _saveAccountInfoToStorage(accountId: number) {
    sessionStorage.setItem('CreateQuoteSelectedAccount', accountId.toString());
    sessionStorage.setItem('CreateQuoteSelectedAccountName', this._getAccountNameFromId(accountId));
  }

  private _getAccountNameFromId(accountId: number): string {
    return this.accounts.find(ac => ac.accountId === accountId)?.name;
  }

  private async _selectedAccountHasSaveOnlineQuotePermission() {
    const selectedAccountId = this.multiAccountsService.getSelectedAccount();
    await this._loadUserAccounts();
    const account = this._getAccountById(selectedAccountId);
    return account.permissions.some(p => p === PERMISSIONS.SaveOnlineQuote);
  }

  private _getAccountById(accountId: number) {
    return this.accounts.find(acc => acc.accountId === accountId);
  }

  private _loadUserAccounts() {
    return this.accountService
      .loadCurrentUser()
      .pipe(
        tap(user => this.accounts = user.accounts)
      ).toPromise();
  }

  private _getAccountsWithSaveOnlineQuotePermission() {
    return this.accounts.filter(acc => acc.permissions.some(p => p === PERMISSIONS.SaveOnlineQuote));
  }

  private _setAccountName(name: string) {
    this.form.patchValue({
      'createdByAccount': name
    });
    this.accountName = name;
  }

  private _initializeLookups() {
    forkJoin(
      [
        this.contactService.getCustomerContacts(this.accountId),
        this.quotingToolService.getEnums(this.accountId),
        this.locationService.getCountries()
      ]
    ).subscribe(([
      contacts,
      enums,
      countries
    ]) => {
      this.jobStatusDataSource = enums.jobStatus;
      this.buildingTypesDataSource = enums.buildingTypes;
      this.customerContacts = contacts;
      this.countries = countries;
      this._fillValues();
      this.isLoading = false;
    });
  }

  private _initializeForm() {
    const createdByAccount = new UntypedFormControl(null, []);
    createdByAccount.disable();

    this.form = new UntypedFormGroup({
      'createdByAccount': createdByAccount,
      'creationDate': new UntypedFormControl(null, []),
      'jobStatus': new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),
      'modernization': new UntypedFormControl(false, []),
      'newConstruction': new UntypedFormControl(false, []),
      'jobName': new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
      'buildingType': new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),
      'contact': new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),
      'contactId': new UntypedFormControl('', []),
      'biddingDate': new UntypedFormControl(null, [SmartriseValidators.requiredWithTrim, SmartriseValidators.lessThanToday]),
      'jobLocation': new UntypedFormControl(new JobLocationView(), []),
      'consultantName': new UntypedFormControl('', [this.consultantNameRequired.bind(this), trimValidator]),
      'unknownConsultant': new UntypedFormControl(false, []),
      'phone': new UntypedFormControl('', []),
      'email': new UntypedFormControl('', []),
    });
    this.form.markAllAsTouched();
  }

  private _fillValues() {
    let creationDateDefaultvalue = new Date();
    creationDateDefaultvalue.setHours(0, 0, 0, 0);

    const email = this.tokenService.getProperty('email');
    const contact = this.customerContacts.filter(x => x.email === email);
    if (contact.length > 0) {
      this.form.patchValue({
        contactId: contact[0].id,
        contact: contact[0].fullName,
        email: contact[0].email,
        phone: contact[0].phone,
        creationDate: creationDateDefaultvalue,
      });
    } else {
      this.form.patchValue({
        creationDate: creationDateDefaultvalue,
      });
    }
  }

  onJobStatusChange(event) {
    if (event === 'Bidding') {
      this.form.controls['biddingDate'].enable();
    } else if (event === 'Won') {
      this.form.controls['biddingDate'].disable();
    }
    this.form.patchValue({
      biddingDate: null
    });
  }

  dateKeyPress(event) {
    FunctionConstants.applyMask(event, '99/99/9999');
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    if (this.isLoading) {
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.form.value.biddingDate)
      this.form.value.biddingDate = this.mockUtcDate(this.form.value.biddingDate);

    if (this.form.value.creationDate)
      this.form.value.creationDate = this.mockUtcDate(this.form.value.creationDate);

    const createQuotePayload = Mapper.map(new CreateQuoteView(this.form.value), CreateQuotePayload);
    createQuotePayload.customerId = this.accountId;

    this.quotingToolService.createQuote(createQuotePayload).subscribe((result: any) => {
      this.messageService.showSuccessMessage('Quote has been created successfully');
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${result.quoteId}`);
    }, error => {
      this.isLoading = false;
    });
  }

  onSelectContact() {
    this.hideErrorsPanel = false;
    this._showContactPopup();
    this.modalRef.content.refresh.subscribe(() => {
      this.contactService.getCustomerContacts(this.multiAccountsService.getSelectedAccount()).subscribe(contacts => {
        this.customerContacts = contacts;
        this.modalRef.content.options = contacts;
        this.modalRef.content.isRefreshingContacts = false;
      }, error => {
        this.modalRef.content.isRefreshingContacts = false;
      });
    });
    this.modalRef.onHidden.subscribe(() => {
      this.hideErrorsPanel = true;

      if (!this.modalRef.content?.selectedContact) {
        return;
      }

      this.selectedContact = this.modalRef.content?.selectedContact;
      this.disableEmail = this.modalRef.content?.selectedContact && this.modalRef.content?.selectedContact?.email;
      // if (!this.selectedContact)
      //   this.form.controls['email'].disable();

      // if (this.selectedContact && this.selectedContact.email) {
      //   this.form.controls['email'].disable();
      // } else if (this.selectedContact && !this.selectedContact.email) {
      //   this.form.controls['email'].enable();
      // }

      this.form.patchValue({
        contactId: this.modalRef.content?.selectedContact?.id,
        contact: this.modalRef.content?.selectedContact?.fullName,
        email: this.modalRef.content?.selectedContact?.email,
        phone: this.modalRef.content?.selectedContact?.phone,
      });
    });
  }

  private _showContactPopup() {
    this.modalRef = this.modalService.show<SearchableContactsListComponent>(SearchableContactsListComponent, {
      class: 'centered adjustable-modal',
      initialState: {
        title: 'Contacts',
        options: this.customerContacts,
        autocompleteDisplayField: 'fullName',
        autocompleteValueField: 'id',
        initialValue: this.quote.contactId
      }
    });
  }

  onRemoveContact() {
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this contact?', () => {
      this.form.patchValue({
        contactId: null,
        contact: null,
        email: null,
        phone: null,
      });
    });
  }

  onCancel() {
    this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}`);
  }

  onUnknownConsultantChanged(event) {
    if (event) {
      this.form.patchValue({
        consultantName: null
      });
      setTimeout(() => this.form.controls['consultantName'].disable());
    } else {
      setTimeout(() => this.form.controls['consultantName'].enable());
    }
  }

  onFixDropdDownScroll() {
    this.selectHelperService.allowOnScroll.next(false);
  }
}
