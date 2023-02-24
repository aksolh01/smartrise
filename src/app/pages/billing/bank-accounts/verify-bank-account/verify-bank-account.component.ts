import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BankAccountService } from '../../../../services/bank-account.service';
import { MessageService } from '../../../../services/message.service';
import { FunctionConstants, SmartriseValidators } from '../../../../_shared/constants';
import { allowOnlyNumbers } from '../../../../_shared/functions';

@Component({
  selector: 'ngx-verify-bank-account',
  templateUrl: './verify-bank-account.component.html',
  styleUrls: ['./verify-bank-account.component.scss']
})
export class VerifyBankAccountComponent implements OnInit {

  id: number;
  microdepositForm: UntypedFormGroup;
  isVerifying = false;
  failedAttempts = 0;
  accountDeleted = false;
  hasAttempts = false;
  attempts: number;
  showAttempts: boolean;
  last4: any;
  isLoading = false;
  formSubmitted: boolean;

  constructor(
    private messageService: MessageService,
    private ref: BsModalRef,
    private bankAccountService: BankAccountService
  ) { }

  ngOnInit() {
    this._createForm();
    // const preVerifyResult = this.bankAccountService.preVerifyBankAccount(this.id).subscribe(r => {
    //   this.attempts = r.failedAttempts;
    //   this.last4 = r.last4;
    //   this.isLoading = false;
    //   if (this.attempts > 0 && this.attempts < 3) {
    //     this.showAttempts = true;
    //   }
    // }, error => {
    //   this.ref.hide();
    // });
  }

  private _createForm() {
    this.microdepositForm = new UntypedFormGroup({
      firstAmount: new UntypedFormControl('', [Validators.required, SmartriseValidators.greaterThanZero]),
      secondAmount: new UntypedFormControl('', [Validators.required, SmartriseValidators.greaterThanZero]),
    });
    this.microdepositForm.markAllAsTouched();
  }

  onSubmit() {
    this.formSubmitted = true;
    if(this.microdepositForm.invalid) {
      return;
    }
    this.verify();
  }

  verify() {

    this.accountDeleted = false;
    this.showAttempts = false;
    this.isVerifying = true;

    this.bankAccountService.verifyBankAccount({
      firstAmount: +this.microdepositForm.value.firstAmount,
      secondAmount: +this.microdepositForm.value.secondAmount,
      stripeBankAccountId: this.id
    }).subscribe(result => {
      this.isVerifying = false;
      this.messageService.showSuccessMessage('Bank Account has been verified successfully');
      this.ref.hide();
    }, error => {
      this.isVerifying = false;
      if (!error?.error?.failedResult) {
        this.showAttempts = false;
        return;
      }

      if (error?.error?.failedResult >= 3) {
        this.accountDeleted = true;
      } else if (error?.error?.failedResult < 3) {
        this.attempts = error?.error?.failedResult;
        this.showAttempts = true;
      }
    });
  }

  cancel() {
    this.ref.hide();
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }
}
