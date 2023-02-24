import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Mapper } from '@nartc/automapper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BankAccountService } from '../../../services/bank-account.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SmartriseValidators } from '../../../_shared/constants';
import { IBankAccountDetails } from '../../../_shared/models/bank-account.model';
import { IUpdateBankAccountDto, UpdateBankAccountPayload } from '../../../_shared/models/banks/dtos';
import { IUpdateBankAccountObjectModel, UpdateBankAccountObjectModel } from '../../../_shared/models/banks/object-models';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { trimValidator } from '../../../_shared/validators/trim-validator';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-edit-bank-account',
  templateUrl: './edit-bank-account.component.html',
  styleUrls: ['./edit-bank-account.component.scss']
})
export class EditBankAccountComponent extends BaseComponent implements OnInit {

  bankAccountForm: UntypedFormGroup;
  isLoading = true;
  isSaving = false;
  bankAccount: IBankAccountDetails = null;
  runGuidingTour: boolean;
  isSmartriseUser: boolean;
  modelref: any;
  isSmall = false;
  responsiveSubscription: Subscription;
  formSubmitted = false;
  displayAccountName: boolean;

  constructor(
    private bankAccountService: BankAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private bcService: BreadcrumbService,
    private modalService: BsModalService,
    private responsiveService: ResponsiveService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
    private multiAccountsService: MultiAccountsService
  ) {
    super(baseService);
    this.bcService.set('@bankAccount', { skip: true });
  }

  ngOnDestroy(): void {
    this.responsiveSubscription.unsubscribe();
    this.modalService.hide();
  }

  async ngOnInit() {
    const bankAccountId = +this.route.snapshot.paramMap.get('id');

    if (!isFinite(bankAccountId)) {
      this.router.navigateByUrl('pages/billing/bank-accounts');
      return;
    }

    this.bankAccountForm = new UntypedFormGroup({
      accountType: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
      accountHolderName: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
    });
    this.bankAccountForm.markAllAsTouched();

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.displayAccountName = this.multiAccountsService.hasMultipleAccounts();

    this.bcService.set('@bankAccount', { skip: true });

    this.bankAccountService.getBankAccount(bankAccountId)
      .subscribe((result) => {
        this.bankAccount = result;
        this.bcService.set('@bankAccount', this.bankAccount.last4);
        this.bcService.set('@bankAccount', { skip: false });
        this.isLoading = false;
        this.bankAccountForm.patchValue({
          accountType: result.accountType ?? '',
          accountHolderName: result.accountHolderName ?? '',
        });
      }, (error) => {
        this.isLoading = false;
        this.router.navigateByUrl('pages/billing/bank-accounts');
      });

    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.bankAccountForm.invalid) {
      return;
    }

    const updateBankAccount = new UpdateBankAccountPayload({
      ...this.bankAccountForm.value,
      id: this.bankAccount.id
    });

    this.isSaving = true;
    this.bankAccountService.updateBankAccount(updateBankAccount).subscribe(() => {
      this.messageService.showSuccessMessage('Bank Account has been updated successfully');
      this.router.navigateByUrl('pages/billing/bank-accounts');
      this.isSaving = false;
    }, error => {
      this.isSaving = false;
    });
  }

  onClose() {
    this.router.navigateByUrl('pages/billing/bank-accounts');
  }
}
