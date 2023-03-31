import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FunctionConstants, SmartriseValidators } from '../../_shared/constants';
import { IAskForAccessDto } from '../../_shared/models/ask-for-access-dto';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { ResponsiveService } from '../../services/responsive.service';
import { trimValidator } from '../../_shared/validators/trim-validator';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-ask-for-access',
  templateUrl: './ask-for-access.component.html',
  styleUrls: ['./ask-for-access.component.scss']
})
export class AskForAccessComponent implements OnInit, IAuthPageComponent {
  pageTitle = 'Request Access';
  form: UntypedFormGroup;
  isLoading = false;
  succuessMessage: string;
  phoneCountry: any;
  // USA dial code
  dialCode = '1';
  isSmall = false;
  defaultPhoneNumber = '';
  formSubmitted = false;

  constructor(private accountService: AccountService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private router: Router) { }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
    this._createForm();
    this.setCountryCode();
  }

  setCountryCode() {
    this.defaultPhoneNumber = `+${this.dialCode}`;
    this.form.controls.phoneNumber.setValue(this.defaultPhoneNumber);
  }

  keyPress(event: any) {
    //FunctionConstants.applyMask(event, '+1 999-999-9999');
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    // keyCode = 8 => backspace
    if (event.keyCode === 8) {
      return;
    } else if (inputChar === '-' && this.form.controls.phoneNumber.value.slice(-1) === '-') {
      event.preventDefault();
    } else if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const payload: IAskForAccessDto = this.form.value;
    //payload.phoneNumber = `+${this.dialCode} ${payload.phoneNumber}`;

    this.accountService.askForAccess(payload)
      .subscribe(
        () => {
          this.succuessMessage = 'A customer support team member will contact you shortly to provide access to the Customer Portal.';
          this._clearForm();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  countryChange(country: any) {
    if (country != null && Object.keys(country).length !== 0) {
      this.dialCode = country.dialCode;
      this.setCountryCode();
    }
  }

  countryFormats = new Map();
  initializeMap() {
    this.countryFormats.set('93', '[0-9]{2} [0-9]{3}-[0-9]{4}');
    this.countryFormats.set('355', '[0-9]{1,3} [0-9]{3} [0-9]{4}');

  }

  private _createForm() {
    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      lastName: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      title: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      businessAddress: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      zipCode: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      companyName: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      phoneNumber: new UntypedFormControl('', [this._phoneRequired.bind(this), trimValidator, SmartriseValidators.requiredWithTrim]),
      country: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      state: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      city: new UntypedFormControl('', [Validators.required, trimValidator, SmartriseValidators.requiredWithTrim]),
      email: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.smartriseEmail]),
    });
    this.form.markAllAsTouched();
  }

  private _phoneRequired(control: AbstractControl) {
    if (!control.value || control.value.trim() == `+${this.dialCode}` || control.value.trim().length < `+${this.dialCode}`.length) {
      return { required: true };
    }
    return null;
  }

  private _clearForm(): void {
    this.form.reset();
  }

  goToLogin() {
    this.router.navigateByUrl('auth/login');
  }
}
