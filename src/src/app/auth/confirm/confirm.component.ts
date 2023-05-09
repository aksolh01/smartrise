import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { MessageService } from '../../services/message.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit, IAuthPageComponent {

  @ViewChild('email') email: ElementRef;
  isLoading = true;
  isConfirmed = false;
  isSignedIn = false;
  invalidToken = false;
  confirmForm: UntypedFormGroup;
  returnUrl: string;
  userId = '';
  token = '';
  emailAddress = '';
  firstName = '';
  lastName = '';
  error: string;
  pageTitle = 'Invitation Form';
  formSubmitted = false;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {

    this.createConfirmForm();

    this.userId = this.activatedRoute.snapshot.queryParams['userid'];
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.emailAddress = this.activatedRoute.snapshot.queryParams['email'];
    this.firstName = this.activatedRoute.snapshot.queryParams['fname'];
    this.lastName = this.activatedRoute.snapshot.queryParams['lname'];

    this.accountService.validateTokes({
      userId: this.userId,
      tokenType: 'ConfirmationEmailToken',
      token: this.token,
    }).subscribe(r => {
      this.isLoading = false;
      this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || this.permissionService.getDefaultRoute();
      if (this.userId != null && this.token != null && this.emailAddress != null) {
        this.createConfirmForm();
      }
    }, error => {
      this.invalidToken = true;
    });
  }

  createConfirmForm() {

    // if (this.account == null) {
    //   this.account = {
    //     firstName: '',
    //     lastName: '',
    //     createdAtUTC: '',
    //     email: '',
    //     lastModifiedAtUTC: '',
    //     userName: ''
    //   };
    // }

    const email = new UntypedFormControl(this.emailAddress, [
      Validators.required,
    ]);
    email.disable();
    this.confirmForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(this.firstName, [Validators.required]),
      lastName: new UntypedFormControl(this.lastName, [Validators.required]),
      email,
      password: new UntypedFormControl('', [Validators.required, ConfirmComponent.password, this.passordsMatching.bind(this)]),
      confirmPassword: new UntypedFormControl('', [Validators.required, ConfirmComponent.password, this.confirmPassordsMatching.bind(this)]),
    });
    this.confirmForm.markAllAsTouched();
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

  onSubmit() {

    this.formSubmitted = true;
    this.error = '';
    if (this.confirmForm.invalid) {
      return;
    }

    this.accountService.confirm({
      ...this.confirmForm.value,
      userId: this.userId,
      token: this.token,
    }).subscribe(
      () => {
        this.isConfirmed = true;
        this.setSignedInFlags();
        this.router.navigateByUrl('auth/signedin-validation');
      },
      (error) => {
      },
    );
  }

  setSignedInFlags() {
    localStorage.setItem('isProcessed', 'true');
    localStorage.setItem('message', 'Email has been confirmed successfully.');
  }

  confirmPassordsMatching(confirmPasswordControl: UntypedFormControl) {
    const newPassword = this.confirmForm?.get('password')?.value;
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
    const confirmPassword = this.confirmForm?.get('confirmPassword');
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

  onGoToLogin() {
    this.accountService.isLoggedInV2().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.isSignedIn = isLoggedIn;
      } else {
this.router.navigateByUrl('auth/login');
}
    }, error => {
    });
  }
}
