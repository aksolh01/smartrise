import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SmartriseValidators } from '../../_shared/constants';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { ResponsiveService } from '../../services/responsive.service';
import { trimValidator } from '../../_shared/validators/trim-validator';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, IAuthPageComponent {
  pageTitle = 'Forgot Password';
  form: UntypedFormGroup;
  isLoading = false;
  succuessMessage: string;
  isSmall = false;
  formSubmitted = false;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(x => {
      if (x === ScreenBreakpoint.md || x === ScreenBreakpoint.sm || x === ScreenBreakpoint.xs) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
    });
    this.createLoginForm();
  }

  createLoginForm() {
    this.form = new UntypedFormGroup({
      emailAddress: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.smartriseEmail]),
    });
    this.form.markAllAsTouched();
  }

  onSubmit() {

    this.formSubmitted = true;
    if(this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.accountService
      .resetAnonymousPasswordRequest(this.form.value)
      .subscribe(
        () => {
          this.succuessMessage = 'An email to reset your password has been sent successfully.';
          this._clearForm();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  private _clearForm(): void {
    this.form.setValue({ emailAddress: '' });
    this.form.get('emailAddress').markAsPristine();
    this.form.get('emailAddress').markAsUntouched();
  }

  goToLogin() {
    this.router.navigateByUrl('auth/login');
  }
}
