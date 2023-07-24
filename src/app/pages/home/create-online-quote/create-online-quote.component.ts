import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobLocationView } from '../../../_shared/models/quotes/quote-view.model';
import { SmartriseValidators, URLs } from '../../../_shared/constants';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { IUserAccountLookup } from '../../../_shared/models/IUser';
import { ContactService } from '../../../services/contact.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'ngx-create-online-quote',
  templateUrl: './create-online-quote.component.html',
  styleUrls: ['./create-online-quote.component.scss']
})
export class CreateOnlineQuoteComponent implements OnInit {

  isLoading = false;
  @Input() countries: any[];
  @Input() accounts: IUserAccountLookup[] = [];
  form: FormGroup;
  formSubmitted: boolean;

  constructor(
    private locationService: LocationService,
    private quotingToolService: QuotingToolService,
    private messageService: MessageService,
    private router: Router,
    private multiAccountsService: MultiAccountsService,
    private contactService: ContactService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    const selectedAccount = this.multiAccountsService.getSelectedAccount();
    if (selectedAccount) {
      this.onAccountChanged(selectedAccount);
    }
    this.form = new FormGroup({
      'jobName': new FormControl('', [SmartriseValidators.requiredWithTrim, SmartriseValidators.trimError]),
      'jobLocation': new FormControl(new JobLocationView(), [Validators.required]),
      'controllerType': new FormControl('', [Validators.required]),
      'customerId': new FormControl(selectedAccount, [Validators.required]),
      'contactId': new FormControl(),
      'email': new FormControl(),
    });
    this.form.markAllAsTouched();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.form.invalid && !this.isLoading) {
      return;
    }

    this.isLoading = true;
    const createQuotePayload = this._appendDefaultValues();
    this.quotingToolService.createOnlineQuote(createQuotePayload).subscribe((result: any) => {
      this.messageService.showSuccessMessage('Quote has been created successfully');
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${result.quoteId}`);
    }, error => {
      this.isLoading = false;
    });
  }

  private _appendDefaultValues() {
    const newQuote = {
      creationDate: new Date(Date.now()),
      controllerType: this.form.value.controllerType,
      jobStatus: 'Won',
      modernization: false,
      newConstruction: false,
      jobName: this.form.value.jobName,
      buildingType: null,
      contact: null,
      contactId: this.form.value.contactId,
      biddingDate: null,
      stateValue: this.form.value.jobLocation.state.value,
      city: this.form.value.jobLocation.city,
      consultantName: null,
      unknownConsultant: false,
      phone: null,
      email: this.form.value.email,
      customerId: this.form.value.customerId
    };
    return newQuote;
  }

  onControllerTypeChanged(controllerType: string, checked: boolean) {
    this.form.patchValue({
      'controllerType': (checked ? controllerType : '')
    });
  }

  onAccountChanged(accountId: number) {
    const email = this.tokenService.getProperty('email');
    this.contactService.getCustomerContacts(accountId).subscribe(contacts => {
      const contact = contacts.filter(x => x.email === email);
      if (contact.length > 0) {
        this.form.patchValue({
          contactId: contact[0].id,
          email: contact[0].email,
          phone: contact[0].phone,
        });
      }
    });
  }
}
