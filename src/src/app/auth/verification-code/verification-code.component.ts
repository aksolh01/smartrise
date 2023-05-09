import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { PermissionService } from '../../services/permission.service';
import { ResponsiveService } from '../../services/responsive.service';
import { IAuthPageComponent } from '../auth-page.interface';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/pairwise';
import { SmartriseValidators, URLs } from '../../_shared/constants';
import { Subscription } from 'rxjs';
import { MultiAccountsService } from '../../services/multi-accounts-service';
import { IUser } from '../../_shared/models/IUser';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { AccountService } from '../../services/account.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'ngx-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit, OnDestroy, IAuthPageComponent {
  readonly milliSecondsInSecond = 1_000;
  readonly milliSecondsInMinute = 60_000;

  isSmall = false;
  isLoading = false;
  isGeneratingCode = false;
  canGenerateCode?: boolean = null;
  timeToGenerateCode: string = null;

  email: string;
  public twoStepForm: UntypedFormGroup;
  public showError: boolean;
  private _provider: string;
  private _returnUrl: string;
  //errorMessage: string;
  //succuessMessage: string;
  backgroundCheckCanGenerateCode: NodeJS.Timeout;
  canGenerateCodeAfter = 0;
  responsiveSubscription: Subscription;
  formSubmitted: boolean;

  constructor(
    private accountService: AccountService,
    private _route: ActivatedRoute,
    private permissionService: PermissionService,
    private responsiveService: ResponsiveService,
    private _messageService: MessageService,
    private _multiAccountService: MultiAccountsService,
    private _router: Router,) {
  }

  pageTitle = 'Verify Identity';
  showPolicy?: boolean;

  async ngOnInit() {
    this._provider = this._route.snapshot.queryParams['provider'];
    this.email = this._route.snapshot.queryParams['email'];
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'];

    this.twoStepForm = new UntypedFormGroup({
      twoFactorCode: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, SmartriseValidators.verificationCode]),
    });
    this.twoStepForm.markAllAsTouched();

    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });

    //if (sessionStorage.getItem('verification-success-message')) {
    //this.fillSuccessMessageStorage();
    //}

    this.checkCanGenerateCode();
  }

  checkCanGenerateCode() {
    this.accountService.canGenerateCodeAfter(this.email).subscribe(res => {
      this._initializeCanGenerateCode(res.canGenerateCodeAfter);
    });
  }

  private _initializeCanGenerateCode(timeBeforeGenerateCode: number) {

    if (timeBeforeGenerateCode === 0) {
      this.canGenerateCode = true;
      return;
    }

    this.canGenerateCodeAfter = timeBeforeGenerateCode;

    const now = new Date(Date.now());
    const after2Minutes = new Date(now);
    after2Minutes.setTime(after2Minutes.getTime() + this.canGenerateCodeAfter * this.milliSecondsInSecond);

    let interval = after2Minutes.getTime() - now.getTime();
    this.timeToGenerateCode = this._getTimeAsString(interval);
    this.canGenerateCode = false;

    const b = setInterval(() => {
      interval = interval - this.milliSecondsInSecond;
      this.timeToGenerateCode = this._getTimeAsString(interval);
    }, this.milliSecondsInSecond);

    setTimeout(() => {
      clearInterval(b);
      this.timeToGenerateCode = null;
      this.canGenerateCode = true;
    }, this.canGenerateCodeAfter * this.milliSecondsInSecond);
  }

  private _getTimeAsString(interval: number) {
    const minutes = Math.floor(interval / 60000);
    const seconds = Math.floor((interval - (minutes * this.milliSecondsInMinute)) / 1000);

    return `${(minutes < 10 ? '0' : '')}${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

  public validateControl = (controlName: string) => this.twoStepForm.controls[controlName].invalid && this.twoStepForm.controls[controlName].touched;
  public hasError = (controlName: string, errorName: string) => this.twoStepForm.controls[controlName].hasError(errorName);

  /*onChangeEvent(event) {
    if (event.keyCode === 8 && event.target.value.toString().trim().length === 1) {
      this.errorMessage = null;
    }
  }*/

  public loginUser = (twoStepFromValue) => {

    this.formSubmitted = true;
    if (this.twoStepForm.invalid) {
      return;
    }

    this.showError = false;

    const formValue = { ...twoStepFromValue };
    const twoFactorDto = {
      email: this.email,
      provider: this._provider,
      code: formValue.twoFactorCode
    };
    //this.errorMessage = null;
    //this.clearSuccessMessageStorage();
    this.isLoading = true;
    this.accountService.verify(twoFactorDto)
      .subscribe(res => {
        sessionStorage.removeItem('allow-verification');
        this.isLoading = false;
        this.accountService.loadCurrentUser(res.token).subscribe(
          (currentUser) => this._currentUserLoadedCallback(currentUser),
          (error) => this.isLoading = false
        );
      },
        error => {
          this.isLoading = false;
        });
  };

  private _currentUserLoadedCallback(currentUser: IUser) {
    this._setLinkedAccounts(currentUser);
    if (this._multiAccountService.hasOneAccount()) {
      this._multiAccountService.setSelectedAccount(currentUser?.accounts[0]?.accountId);
    }
    this.permissionService.setPermissions(currentUser.accounts);
    this._router.navigateByUrl(this._returnUrl);
  }

  private _setLinkedAccounts(user: IUser) {
    this._multiAccountService.setAccounts(user?.accounts);
  }

  onGenerateCode() {
    //this.clearSuccessMessageStorage();
    this.isGeneratingCode = true;
    this.twoStepForm.patchValue({ twoFactorCode: null });
    //this.errorMessage = null;
    this.accountService.regenerateCode({ email: this.email }).subscribe(x => {
      //this.fillSuccessMessageStorage();
      this._messageService.showSuccessMessage('A new Security Code has been sent to your Email');
      this.isGeneratingCode = false;
      this._initializeCanGenerateCode(x.remainingSeconds);
    }, error => {
      //this.errorMessage = error?.error?.detail;
      this.isGeneratingCode = false;
    });
  }

  //fillSuccessMessageStorage() {
  //this.succuessMessage = `A Security Code has been sent successfully to the email: \n` + this.email;
  //this.succuessMessage = this.succuessMessage.replace('\n', '<br/>');
  //sessionStorage.setItem('verification-success-message', '1');
  //}

  //clearSuccessMessageStorage() {
  //this.succuessMessage = null;
  //sessionStorage.removeItem('verification-success-message');
  //}

  ngOnDestroy(): void {
    if (this.backgroundCheckCanGenerateCode) {
      clearInterval(this.backgroundCheckCanGenerateCode);
    }

    this.responsiveSubscription.unsubscribe();
  }
}
