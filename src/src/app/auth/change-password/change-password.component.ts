import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, IAuthPageComponent {
  changePasswordForm: UntypedFormGroup;
  returnUrl: string;
  errorMessage: string;
  userId: string;
  token: string;
  succuessMessage: string = null;
  isLoading = false;
  pageTitle = 'Change Password';
  formSubmitted = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
  ) { }


  ngOnInit(): void {
    this.createChangePasswordForm();
  }

  createChangePasswordForm() {
    this.changePasswordForm = new UntypedFormGroup({
      currentPassword: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required, ChangePasswordComponent.password, this.passordsMatching.bind(this)]),
      confirmPassword: new UntypedFormControl('', [Validators.required, ChangePasswordComponent.password, this.confirmPassordsMatching.bind(this)]),
    });
    this.changePasswordForm.markAllAsTouched();
  }

  onSubmit() {

    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.changePasswordForm.invalid) {
      return;
    }


    this.isLoading = true;
    this.accountService.changePassword({
      ...this.changePasswordForm.value,
    }).subscribe(() => {
      this.isLoading = false;
      // this.router.navigateByUrl(this.returnUrl);
      this.succuessMessage = 'Password has been changed successfully.';
    }, error => {
      this.isLoading = false;
    });
  }

  back() {
    this.router.navigate(['pages/dashboard'], {});
  }

  confirmPassordsMatching(confirmPasswordControl: UntypedFormControl) {
    const newPassword = this.changePasswordForm?.get('password')?.value;
    const confirmPassword = confirmPasswordControl?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword !== confirmPassword) {
      return {
        mismatchingPasswords: true
      };
    }
    return null;
  }

  passordsMatching(passwordControl: UntypedFormControl) {
    const newPassword = passwordControl.value;
    const confirmPassword = this.changePasswordForm?.get('confirmPassword');
    const confirmPasswordValue = confirmPassword?.value;

    if (!newPassword || !confirmPasswordValue) {
      return null;
    }

    if (newPassword === confirmPasswordValue) {
      confirmPassword.setErrors(null);
      return;
    }

    if (newPassword !== confirmPasswordValue) {
      confirmPassword.setErrors({
        mismatchingPasswords: true
      });
      return;
    }
    return null;
  }

  static password(control: UntypedFormControl): { [key: string]: boolean } {

    if (control.value === '') {
return null;
}


    const hasAlpabetSmall = /[a-z]+/.test(control.value);
    const hasAlpabetCapital = /[A-Z]+/.test(control.value);
    const hasNonAlpabet = /[^a-zA-Z0-9]+/.test(control.value);
    const hasAtLeastOneNumber = /[0-9]+/.test(control.value);
    const moreThan8Char = /^.{8,}$/.test(control.value);

    if (
      hasAlpabetSmall &&
      hasAlpabetCapital &&
      hasNonAlpabet &&
      moreThan8Char &&
      hasAtLeastOneNumber
    ) {
return null;
}
    return { invalidPassword: true };
  }
}
