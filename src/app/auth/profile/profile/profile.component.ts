import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, forkJoin, switchMap } from 'rxjs';
import { SmartriseValidators, StorageConstants } from '../../../_shared/constants';
import { IUser } from '../../../_shared/models/IUser';
import { AccountService } from '../../../services/account.service';
import { ImageService } from '../../../services/image.service';
import { MessageService } from '../../../services/message.service';
import { RoutingService } from '../../../services/routing.service';
import { TokenService } from '../../../services/token.service';
import { trimValidator } from '../../../_shared/validators/trim-validator';
import { BrowserService, Browser } from '../../../services/browser-service';
import { ResponsiveService } from '../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { IUserProfileInfo } from '../../../_shared/models/IUserProfileInfo';
import { LocationService } from '../../../services/location.service';
import { SelectHelperService } from '../../../services/select-helper.service';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [LocationService]
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileForm: UntypedFormGroup;
  userProfileInfo: IUserProfileInfo;
  securityIsActive = false;
  personalInfoIsActive = true;
  formSubmitted = false;

  countries: any[] = [];
  states: any[] = [];
  proflieLoading: boolean;
  showRemoveButton: boolean;
  hasInitialProfilePicture = false;
  picurl = 'assets/profile-placeholder.png';
  imageToShow: any;
  file: File;
  subscriptionProfilePicture: Subscription;
  photoGuid = null;
  pageTitle = 'Edit Profile';
  isLoading = false;
  isDataLoading = true;
  pUrl: string;
  isSmall = false;
  addWhiteSpace = false;
  currentUser$: Observable<IUser>;

  constructor(
    private accountService: AccountService,
    private tokenService: TokenService,
    private imageService: ImageService,
    private messageService: MessageService,
    private selectHelperService: SelectHelperService,
    private routingService: RoutingService,
    private router: Router,
    private browserService: BrowserService,
    private responsiveService: ResponsiveService,
    private locationService: LocationService,
  ) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;

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

      if (this.browserService.detectBrowserName() === Browser.Firefox && this.isSmall) {
        this.addWhiteSpace = true;
      }
    });

    if (!sessionStorage.getItem(StorageConstants.PreviousUrl)) {
      this.pUrl = this.routingService.getPreviousUrl();
      sessionStorage.setItem(StorageConstants.PreviousUrl, this.pUrl);
    } else {
      this.pUrl = sessionStorage.getItem(StorageConstants.PreviousUrl);
    }
    this.createProfileForm();
    forkJoin([
      this.accountService.loadProfileInfo(),
      this.locationService.getCountries(),
    ])
      .pipe(switchMap(([userProfileInfo, countries]) => {
        this.countries = countries;
        this.userProfileInfo = userProfileInfo;
        this.photoGuid = this.userProfileInfo?.profilePhoto?.photoGuid;
        this.getImageFromService(this.userProfileInfo?.profilePhoto?.photoGuid);
        return this.locationService.getStates(userProfileInfo.country);
      }))
      .subscribe((states) => {
        this.states = states;
        setTimeout(() => this.fillData());
        this.isDataLoading = false;
      });
  }

  fillData() {
    this.profileForm.patchValue({ twoFactorAuthentication: this.userProfileInfo?.twoFactorAuthentication });
    this.profileForm.patchValue({ firstName: this.userProfileInfo?.firstName });
    this.profileForm.patchValue({ lastName: this.userProfileInfo?.lastName });
    this.profileForm.patchValue({ primaryPhoneNumber: this.userProfileInfo?.primaryPhoneNumber });
    this.profileForm.patchValue({ secondaryPhoneNumber: this.userProfileInfo?.secondaryPhoneNumber });
    this.profileForm.patchValue({ primaryEmailAddress: this.userProfileInfo?.primaryEmailAddress });
    this.profileForm.patchValue({ secondaryEmailAddress: this.userProfileInfo?.secondaryEmailAddress });
    this.profileForm.patchValue({ companyName: this.userProfileInfo?.companyName });
    this.profileForm.patchValue({ businessAddress: this.userProfileInfo?.businessAddress });
    this.profileForm.patchValue({ city: this.userProfileInfo?.city });
    this.profileForm.patchValue({ state: this.userProfileInfo?.state });
    this.profileForm.patchValue({ zipCode: this.userProfileInfo?.zipCode });
    this.profileForm.patchValue({ country: this.userProfileInfo?.country });
    this.profileForm.patchValue({ title: this.userProfileInfo?.title });
  }

  createProfileForm() {
    this.profileForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [
        Validators.required,
        trimValidator,
        SmartriseValidators.requiredWithTrim,
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        trimValidator,
        SmartriseValidators.requiredWithTrim,
      ]),
      primaryPhoneNumber: new UntypedFormControl('', [
        trimValidator,
      ]),
      secondaryPhoneNumber: new UntypedFormControl('', [
        trimValidator,
      ]),
      primaryEmailAddress: new UntypedFormControl('', [
        trimValidator,
      ]),
      secondaryEmailAddress: new UntypedFormControl('', [
        trimValidator,
      ]),
      companyName: new UntypedFormControl('', [
        trimValidator,
      ]),
      businessAddress: new UntypedFormControl('', [
        trimValidator,
      ]),
      city: new UntypedFormControl('', [
        trimValidator,
      ]),
      state: new UntypedFormControl('', [
        trimValidator,
      ]),
      zipCode: new UntypedFormControl('', [
        trimValidator,
      ]),
      country: new UntypedFormControl('', [
        trimValidator,
      ]),
      title: new UntypedFormControl('', [
        trimValidator,
      ])
    });
    this.profileForm.markAllAsTouched();
  }

  onCountrySelected(country) {
    this.locationService.getStates(country).subscribe(states => {
      this.states = states;
      this.profileForm.patchValue({ state: null });
    });
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    console.log("this.profileForm.invalid", this.profileForm)

    this.isLoading = true;

    const personalInfo = { ...this.profileForm.value, email: this.accountService.loadedUser.email };
    this.accountService.updateProfile({
      ...personalInfo
    }).subscribe(
      () => {
        this.isLoading = false;
        this._notifyUserDisplayNameChanged();
        // this.profileForm.controls['primaryPhoneNumber'].value;
        // this.profileForm.controls['secondaryPhoneNumber'].value;
        // this.profileForm.controls['primaryEmailAddress'].value;
        // this.profileForm.controls['secondaryEmailAddress'].value;
        // this.profileForm.controls['companyName'].value;
        // this.profileForm.controls['businessAddress'].value;
        // this.profileForm.controls['city'].value;
        // this.profileForm.controls['state'].value;
        // this.profileForm.controls['zipCode'].value;
        // this.profileForm.controls['country'].value;
        this.messageService.showSuccessMessage('Profile Information has been updated successfully');
      },
      (error) => {
        this.isLoading = false;
      }

    );
    this.router.navigateByUrl('pages/dashboard');
  }

  private _notifyUserDisplayNameChanged() {
    this.accountService.loadCurrentUser()
      .subscribe((user) => this.accountService.updateUserLocal(user));
  }

  getImageFromService(photoGuid: string) {
    if (photoGuid) {
      this.hasInitialProfilePicture = true;
      this.proflieLoading = true;
      this.imageService.getImage(photoGuid).subscribe(
        (data) => {
          this.proflieLoading = false;
          this.showRemoveButton = data?.size > 0;
          this.createImageFromBlob(data);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(StorageConstants.PreviousUrl);
    if (this.subscriptionProfilePicture) {
      this.subscriptionProfilePicture.unsubscribe();
    }
  }

  back() {
    if (this.pUrl.indexOf('auth/login') > -1 || this.pUrl === '/') {
      this.router.navigateByUrl('pages/dashboard');
    } else {
      this.router.navigateByUrl(this.pUrl);
    }
  }

  checkTwoFactorAuthentication(event) {
    this.profileForm.patchValue({ twoFactorAuthentication: event });
  }

  onClickDropDownList() {
    this.selectHelperService.allowOnScroll.next(false);
  }
}
