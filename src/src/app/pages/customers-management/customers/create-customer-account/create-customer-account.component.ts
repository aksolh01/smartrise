import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SmartriseValidators } from '../../../../_shared/constants';
import { ICustomerRecord } from '../../../../_shared/models/customer-lookup';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-create-customer-account',
  templateUrl: './create-customer-account.component.html',
  styleUrls: ['./create-customer-account.component.scss']
})
export class CreateCustomerAccountComponent implements OnInit {
  isLoading = false;
  accountForm: UntypedFormGroup;
  customer: ICustomerRecord;
  errorMessage: string;
  success = new Subject<Object>();
  formSubmitted: boolean;

  constructor(
    private modalRef: BsModalRef<CreateCustomerAccountComponent>,
  ) {
  }

  ngOnInit(): void {
    this.createAccountForm();
  }

  createAccountForm() {
    this.accountForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.customer.name, [Validators.required]),
      email: new UntypedFormControl(this.customer.email, [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.smartriseEmail]),
    });
    this.accountForm.markAllAsTouched();
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.accountForm.invalid) {
      return;
    }

    this.errorMessage = '';

    this.isLoading = true;
    /* this.accountService.register({email: this.accountForm.value.email, customerId: this.customer.id}).subscribe(() => {
      this.isLoading = false;
      this.messageService.showSuccessMessage('Admin account has been created successfully for customer');
      this.success.next(null);
      this.accountForm.reset();
      this.onClose();
    }, error => {
      this.isLoading = false;
      this.messageService.showError(error);
    }); */
  }

  onClose() {
    this.modalRef.hide();
  }
}
