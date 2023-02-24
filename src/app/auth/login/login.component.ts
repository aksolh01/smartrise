import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../pages/base.component';
import { SmartriseValidators, StorageConstants } from '../../_shared/constants';
import { AccountService } from '../../services/account.service';
import { BaseComponentService } from '../../services/base-component.service';
import { MessageService } from '../../services/message.service';
import { PermissionService } from '../../services/permission.service';
import { IAuthPageComponent } from '../auth-page.interface';
import { trimValidator } from '../../_shared/validators/trim-validator';
import { MultiAccountsService } from '../../services/multi-accounts-service';
import { IUser } from '../../_shared/models/IUser';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit, IAuthPageComponent {
  warnUserAboutAccountLock: boolean;
  loginForm: UntypedFormGroup;
  returnUrl: string;
  isLoading = false;
  pageTitle = 'Login';
  showPolicy = true;
  sessionExpired: any;
  formSubmitted = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    baseService: BaseComponentService,
    private multiAccountService: MultiAccountsService,
    private messageService: MessageService) {
    super(baseService);
    this.sessionExpired = history.state.sessionExpired;
  }

  ngOnInit(): void {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams.returnUrl || '/pages/dashboard';
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
      password: new UntypedFormControl('', [Validators.required]),
    });
    this.loginForm.markAllAsTouched();
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.warnUserAboutAccountLock = false;
    this.accountService.login(this.loginForm.value).subscribe(
      (user) => {

        if (user.twoStepVerificationActivated) {
          sessionStorage.setItem('2FAIsActivated', '1');
        }

        if (user.is2StepVerificationRequired) {
          sessionStorage.setItem('verification-success-message', '1');
          sessionStorage.setItem('allow-verification', '1');
          this.router.navigate(
            ['/auth/verification-code'],
            {
              queryParams: {
                returnUrl: this.returnUrl,
                provider: user.provider,
                email: this.loginForm.value.email,
              }
            }
          );
        } else {

          localStorage.setItem(StorageConstants.LOGIN, Date.now().toString());
          this.accountService.loadCurrentUser(user.token).subscribe((currentUser: IUser) => {
            if (this.multiAccountService.hasOneAccount()) {
              this.multiAccountService.setSelectedAccount(currentUser?.accounts[0]?.accountId);
            }
            this.permissionService.setPermissions(currentUser.accounts);
            this._setLinkedAccounts(currentUser);
            this.router.navigateByUrl(this.returnUrl);
          },
          (error) => {
            this.isLoading = false;
          });
        }
      },
      (error) => {
        this.warnUserAboutAccountLock = error?.error?.failedResult?.warnUserAboutAccountLock;
        this.isLoading = false;
      }
    );
  }

  private _setLinkedAccounts(user: IUser) {
    this.multiAccountService.setAccounts(user?.accounts?.map(account => account.accountId));
  }
}
