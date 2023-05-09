import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { ResponsiveService } from '../../services/responsive.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, IAuthPageComponent {

  @ViewChild('email') email: ElementRef;
  emailAddress = '';
  invalidToken = false;
  isCheckingTokenValidity = true;
  resetForm: UntypedFormGroup;
  errorMessage: string;
  returnUrl: string;
  userId: string;
  token: string;
  isLoading = false;
  pageTitle = 'Reset Password';
  isSmall = false;
  formSubmitted: boolean;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private responsiveService: ResponsiveService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
    this.createResetForm();
    this.userId = this.activatedRoute.snapshot.queryParams['userid'];
    this.emailAddress = this.activatedRoute.snapshot.queryParams['email'];
    this.token = this.activatedRoute.snapshot.queryParams['token'];

    this.accountService.validateTokes({
      token: this.token,
      userId: this.userId,
      tokenType: 'ResetPasswordToken',
    }).subscribe(r => {
      this.isLoading = false;
      this.isCheckingTokenValidity = false;
      this.createResetForm();
    }, error => {
      this.invalidToken = true;
      this.isCheckingTokenValidity = false;
    });

    this.returnUrl = '/pages/jobs/list';
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['userid'] && params['token']) {
        this.userId = params['userid'];
        this.token = params['token'];
      }
    });
  }

  createResetForm() {
    const email = new UntypedFormControl(this.emailAddress);
    email.disable();

    this.resetForm = new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required, ResetPasswordComponent.password, this.passordsMatching.bind(this)]),
      confirmPassword: new UntypedFormControl('', [Validators.required, ResetPasswordComponent.password, this.confirmPassordsMatching.bind(this)]),
      email
    });
    this.resetForm.markAllAsTouched();
  }

  onGoToLogin() {
    this.router.navigateByUrl('auth/login');
  }

  confirmPassordsMatching(confirmPasswordControl: UntypedFormControl) {
    const newPassword = this.resetForm?.get('password')?.value;
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
    const confirmPassword = this.resetForm?.get('confirmPassword');
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

  onSubmit() {

    this.formSubmitted = true;

    this.errorMessage = '';

    if (this.resetForm.invalid) {
      return;
    }

    this.accountService.resetPassword({
      ...this.resetForm.value,
      userId: this.userId,
      token: this.token,
    }).subscribe(() => {
      this.setSignedInFlags();
      this.router.navigateByUrl('auth/signedin-validation');
    }, error => {
    });
  }

  setSignedInFlags() {
    localStorage.setItem('isProcessed', 'true');
    localStorage.setItem('message', 'Password has been changed successfully');
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
