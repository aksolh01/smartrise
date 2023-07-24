import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { JoyrideStepInfo } from 'ngx-joyride/lib/models/joyride-step-info.class';
import { Observable, Subscription } from 'rxjs';
import { PERMISSIONS, URLs } from '../../_shared/constants';
import { ICustomerRecord, IRecentCustomer } from '../../_shared/models/customer-lookup';
import { SortDirection } from '../../_shared/models/enums';
import { IUser, IUserAccountLookup } from '../../_shared/models/IUser';
import { IRecentJob } from '../../_shared/models/job';
import { ResourceByCustomerUserParams, ResourceParams } from '../../_shared/models/resourceParams';
import { ScreenBreakpoint } from '../../_shared/models/screenBreakpoint';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { GuidingTourService } from '../../services/guiding.tour.service';
import { JobService } from '../../services/job.service';
import { PermissionService } from '../../services/permission.service';
import { ResourceService } from '../../services/resource.service';
import { ResponsiveService } from '../../services/responsive.service';
import { TokenService } from '../../services/token.service';
import * as guidingTourGlobal from '../guiding.tour.global';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { MultiAccountsService } from '../../services/multi-accounts-service';
import { CustomerParams } from '../../_shared/models/CustomerParams';
import { LocationService } from '../../services/location.service';
import { ContactService } from '../../services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-smr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterContentInit {
  currentUser$: Observable<IUser>;

  subscription: Subscription;
  userSubscription: Subscription;

  show2FAisActivated = false;

  hasAccessToCustomers = false;
  hasAccessToJobListing = false;
  hasAccessToActiveJobs = false;
  hasAccessToJobFiles = false;
  hasAccessToCreateOnlineQuote = false;

  portalTitle = '';
  responsiveSubscription: Subscription;
  currentUserSubscription: Subscription;
  isSmall?: boolean = null;
  isSmartriseUser: boolean;
  displayCustomerName: boolean;

  user: IUser = null;
  isLoadingUserInfo = true;

  recentJobs: IRecentJob[] = null;
  isLoadingRecentJobs = true;

  recentCustomers: IRecentCustomer[] = null;
  isLoadingRecentCustomers = true;

  favoriteCustomers: ICustomerRecord[] = null;
  isLoadingFavoriteCustomers = true;

  latestUploadedFiles: any[] = null;
  isLoadingLatestUploadedFiles = true;

  runGuidingTour = true;
  joyrideLastStepIndex?: number = null;
  desktopSteps: any[string] = ['firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep', 'sixthStep'];
  mobileSteps: any[string] = ['firstStep', 'secondStep', 'mobileThirdStep', 'fourthStep', 'fifthStep', 'sixthStep'];

  desktopGuidingTour: any = {
    steps: this.desktopSteps,
    themeColor: guidingTourGlobal.guidingTourThemeColor,
    customTexts: {
      prev: guidingTourGlobal.guidingTourPrevButtonText,
      next: guidingTourGlobal.guidingTourNextButtonText,
      done: guidingTourGlobal.guidingTourDoneButtonText
    }
  };

  mobileGuidingTour: any = {
    steps: this.mobileSteps,
    themeColor: guidingTourGlobal.guidingTourThemeColor,
    customTexts: {
      prev: guidingTourGlobal.guidingTourPrevButtonText,
      next: guidingTourGlobal.guidingTourNextButtonText,
      done: guidingTourGlobal.guidingTourDoneButtonText
    }
  };

  guidingTourSubscription: Subscription;
  countries: any[];
  isLoadingCountries: boolean = true;
  accounts: IUserAccountLookup[];
  customerContacts: any[];
  activeJobIDs: number[];

  constructor(
    private _guidingTourService: GuidingTourService,
    private readonly _joyrideService: JoyrideService,
    private readonly _tokenService: TokenService,
    private readonly _responsiveService: ResponsiveService,
    private readonly _permissionService: PermissionService,
    private readonly _accountService: AccountService,
    private readonly _jobService: JobService,
    private readonly _customerService: CustomerService,
    private readonly _resourceService: ResourceService,
    private readonly _miscellaneousService: MiscellaneousService,
    private readonly _locationService: LocationService,
    private readonly _multiAccountService: MultiAccountsService,
    private readonly _router: Router) { }

  ngOnInit() {

    this.show2FAisActivated = sessionStorage.getItem('2FAIsActivated') ? true : false;

    this.guidingTourSubscription = this._guidingTourService.subject.subscribe(data => {
      if (data) {
        this.runGuidingTour = data.showTitle;
      }
    });

    this.currentUserSubscription = this._accountService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this._loadData();
      }
    });

    this.subscription = this._accountService.stopImpersonate$.subscribe(() => {
      this._loadData();
    });
  }

  ngAfterContentInit(): void {
    this.responsiveSubscription = this._responsiveService.currentBreakpoint$.subscribe((w) => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (
        w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }

      this._manageStartGuidingTour();
    });
  }

  ngOnDestroy() {
    if (this.responsiveSubscription) {
      this.responsiveSubscription.unsubscribe();
    }

    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this._resourceService.dispose();
    this._stopGuidingTour();
  }

  private _loadData() {
    this._fetchCustomerInfoFromToken();
    this._setDisplayCustomerName();
    this._getAccess().then(() => this._loadComponentsData());
  }

  private _setDisplayCustomerName() {
    this.displayCustomerName = this.isSmartriseUser || this._multiAccountService.hasMultipleAccounts();
  }

  private _loadComponentsData() {
    this._loadProfileData();
    this._loadRecentJobs();
    this._loadRecentCustomers();
    this._loadFavoriteCustomers();
    this._loadLatestUploadedFiles();
    this._loadCountries();
    this._loadLoggedInUserAccounts();
    if (this._miscellaneousService.isCustomerUser())
      this._loadActiveJobIDs();
  }

  private _loadActiveJobIDs() {
    this._jobService.getActiveJobIDs().subscribe(IDs => {
      this.activeJobIDs = IDs;
    });
  }

  private _loadLoggedInUserAccounts() {
    this._accountService.loadCurrentUser().subscribe(x => this.accounts = x.accounts);
  }

  private _loadCountries() {
    this._locationService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.isLoadingCountries = false;
    });
  }

  private _loadProfileData() {
    this.user = null;
    this.isLoadingUserInfo = true;

    this._accountService
      .loadCurrentUser(this._tokenService.getToken())
      .subscribe((user: IUser) => {
        this.user = user;
        this.isLoadingUserInfo = false;
      }, () => {
        this.isLoadingUserInfo = false;
      });
  }

  private _loadRecentJobs() {
    if (!this.hasAccessToJobListing) {
      return;
    }

    this.recentJobs = null;
    this.isLoadingRecentJobs = true;


    if (this._miscellaneousService.isSmartriseUser()) {
      this._jobService.getRecentJobsBySmartriseUser().subscribe((response) => {
        if (response && response.length > 0) {
          this.recentJobs = response;
        }
        this.isLoadingRecentJobs = false;
      }, () => {
        this.isLoadingRecentJobs = false;
      });
    }
    else {
      const selectedAccountId = this._multiAccountService.getSelectedAccountOrDefaultValue(0);

      this._jobService.getRecentJobsByCustomerUser(selectedAccountId).subscribe((response) => {
        if (response && response.length > 0) {
          this.recentJobs = response;
        }
        this.isLoadingRecentJobs = false;
      }, () => {
        this.isLoadingRecentJobs = false;
      });
    }

  }

  private _loadRecentCustomers() {
    if (!this.hasAccessToCustomers) {
      return;
    }

    this.recentCustomers = null;
    this.isLoadingRecentCustomers = true;

    this._customerService.getRecentCustomers().subscribe((response) => {
      if (response && response.length > 0) {
        this.recentCustomers = response;
      }
      this.isLoadingRecentCustomers = false;
    }, () => {
      this.isLoadingRecentCustomers = false;
    });
  }

  private _loadFavoriteCustomers() {
    if (!this.hasAccessToCustomers) {
      return;
    }

    this.favoriteCustomers = null;
    this.isLoadingFavoriteCustomers = true;

    const params: CustomerParams = {
      favoriteCustomer: true,
      pageIndex: 1,
      pageSize: 10,
      epicorCustomerId: null,
      name: null,
      phone: null,
      fax: null,
      sort: 'name',
      sortDirection: SortDirection.Asc,
      search: null
    };

    this._customerService.getCustomers(params).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.favoriteCustomers = response.data;
      }

      this.isLoadingFavoriteCustomers = false;
    }, () => {
      this.isLoadingFavoriteCustomers = false;
    });
  }

  private _loadLatestUploadedFiles() {
    if (!this.hasAccessToJobFiles) {
      return;
    }

    this.latestUploadedFiles = null;
    this.isLoadingLatestUploadedFiles = true;

    const options: ResourceParams = {
      jobName: '',
      sort: 'uploadedAt',
      sortDirection: SortDirection.Desc,
      createDate: null,
      customerMessage: '',
      account: '',
      epicorWaitingInfo: null,
      fileDescription: '',
      grantedShipDate: null,
      jobNumber: null,
      message: '',
      orderDate: null,
      pageIndex: 1,
      pageSize: 5,
      search: null,
      shipDate: null,
      hasUploadedFile: true,
      resourceType: null,
      status: null
    };

    if (this.isSmartriseUser) {
      this._resourceService.getLatestUploadedFilesBySmartriseUser(options).subscribe((result) => {
        if (result.data && result.data.length) {
          this.latestUploadedFiles = result.data;
        }
        this.isLoadingLatestUploadedFiles = false;
      }, () => {
        this.isLoadingLatestUploadedFiles = false;
      });
    } else {
      const searchParams = options as ResourceByCustomerUserParams;
      searchParams.customerId = this._multiAccountService.getSelectedAccount();

      this._resourceService.getLatestUploadedFilesByCustomerUser(searchParams).subscribe((result) => {
        if (result.data && result.data.length) {
          this.latestUploadedFiles = result.data;
        }
        this.isLoadingLatestUploadedFiles = false;
      }, () => {
        this.isLoadingLatestUploadedFiles = false;
      });
    }
  }

  public onRefreshlatestUploadedFiles() {
    this._loadLatestUploadedFiles();
  }

  public onRestartGuidingTour() {
    this._restartGuidingTour();
  }

  private async _getAccess() {
    this.hasAccessToCustomers = await this._permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing);
    this.hasAccessToCreateOnlineQuote = await this._permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote);
    this.hasAccessToJobListing = await this._permissionService.hasPermissionAsync(PERMISSIONS.JobsListing);
    this.hasAccessToJobFiles = await this._permissionService.hasPermissionAsync(PERMISSIONS.ManageJobFiles)
      || await this._permissionService.hasPermissionAsync(PERMISSIONS.ViewResourcesList);
    this.hasAccessToActiveJobs = this._miscellaneousService.isCustomerUser();
  }

  private _fetchCustomerInfoFromToken() {
    this.isSmartriseUser = this._miscellaneousService.isSmartriseUser();
  }

  rerunGuidingTour() {
    this._stopGuidingTour();
    this._startGuidingTour();
  }

  _startGuidingTour() {
    let startStepName: string;

    if (this._joyrideService.isTourInProgress()) {
      this._joyrideService.closeTour();
      localStorage.removeItem('GuidingTourHome');

      if (this.joyrideLastStepIndex != null) {
        if (this.isSmall === true) {
          startStepName = this.mobileSteps[this.joyrideLastStepIndex];
        } else {
          startStepName = this.desktopSteps[this.joyrideLastStepIndex];
        }
      }

    }

    this._guidingTourService.setShowTitle(true);
    if (this.isSmall === true) {
      this.mobileGuidingTour.startWith = startStepName;

      const tour$ = this._joyrideService.startTour(this.mobileGuidingTour);
      tour$.subscribe((step: JoyrideStepInfo) => {
        this.joyrideLastStepIndex = step.number - 1;
      });
    } else {
      this.desktopGuidingTour.startWith = startStepName;

      const tour$ = this._joyrideService.startTour(this.desktopGuidingTour);
      tour$.subscribe((step: JoyrideStepInfo) => {
        this.joyrideLastStepIndex = step.number - 1;
      });
    }
  }

  _stopGuidingTour() {
    if (this._joyrideService && this._joyrideService.isTourInProgress()) {
      this._joyrideService.closeTour();
    }
  }

  _restartGuidingTour() {
    localStorage.removeItem('GuidingTourHome');
    localStorage.removeItem('GuidingTourUserActivities');
    localStorage.removeItem('GuidingTourCustomers');
    localStorage.removeItem('GuidingTourJobs');
    localStorage.removeItem('GuidingTourResources');
    localStorage.removeItem('GuidingTourShipments');
    localStorage.removeItem('GuidingTourCustomerUsers');
    localStorage.removeItem('GuidingTourSmartriseUsers');
    localStorage.removeItem('GuidingTourJobFiles');
    localStorage.removeItem('GuidingTourJobResources');
    localStorage.removeItem('GuidingTourCustomerAdminAccounts');
    localStorage.removeItem('GuidingTourOpenQuotes');
    localStorage.removeItem('GuidingTourQuotes');
    localStorage.removeItem('GuidingTourQuoteDetails');
    localStorage.removeItem('GuidingTourStatementOfAccount');
    localStorage.removeItem('GuidingTourInvoices');
    localStorage.removeItem('GuidingTourBankAccount');
    localStorage.removeItem('GuidingTourAccountUsers');
    localStorage.removeItem('GuidingTourCompanyInfo');

    this._manageStartGuidingTour();
  }

  _manageStartGuidingTour() {
    if (localStorage.getItem('GuidingTourHome') === null) {
      this._startGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  onFinishingTour() {
    this._guidingTourService.finishHomePageTour();
  }

  onClose2FAAlert() {
    sessionStorage.removeItem('2FAIsActivated');
    this.show2FAisActivated = false;
  }

  onViewAllJobs(event: MouseEvent) {
    event.preventDefault();
    this._router.navigateByUrl(URLs.JobsURL);
  }
}
