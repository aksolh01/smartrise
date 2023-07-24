import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbMenuService,
  NbSidebarService,
} from '@nebular/theme';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LayoutService } from '../../../@core/utils';
import { AppComponent } from '../../../app.component';
import { IUser } from '../../../_shared/models/IUser';
import { AccountService } from '../../../services/account.service';
import { GuidingTourService } from '../../../services/guiding.tour.service';
import { TokenService } from '../../../services/token.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectAccountComponent } from '../select-account/select-account.component';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { PermissionService } from '../../../services/permission.service';
import { StorageConstants } from '../../../_shared/constants';
import { RoutingService } from '../../../services/routing.service';
import { SearchService } from '../../../services/search.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  username: string;
  runGuidingTour: boolean = true;
  guidingTourSubscription: Subscription;
  testingEnvironment: boolean = false;
  impersonationModeIsActivated: boolean = false;
  isSmartriseUser: boolean = false;
  userHasMoreThanOneAccount: boolean = false;
  userMenu = [
    { title: 'Profile', link: '/pages/jobs/list' },
    { title: 'Log out' },
  ];

  @ViewChild('search') searchInput: ElementRef<HTMLInputElement>;

  currentUser$: Observable<IUser>;
  isSmall: boolean;
  public constructor(
    private router: Router,
    private menuService: NbMenuService,
    private accountService: AccountService,
    private modalService: BsModalService,
    private multiAccountsService: MultiAccountsService,
    private _sidebarService: NbSidebarService,
    private _layoutService: LayoutService,
    private appComponent: AppComponent,
    private tokenService: TokenService,
    private guidingTourService: GuidingTourService,
    private miscellaneousService: MiscellaneousService,
    private permissionService: PermissionService,
    private routingService: RoutingService,
    private searchService: SearchService,
    private responsiveService: ResponsiveService
  ) { }

  toggleSidebar(): boolean {
    this._sidebarService.toggle(true, 'menu-sidebar');
    this._layoutService.changeLayoutSize();

    return false;
  }

  onFinishingHomeTour() {
    this.guidingTourService.finishHomePageTour();
  }

  ngOnInit() {

    this.responsiveService.currentBreakpoint$.subscribe(w => {
      this.isSmall = (w !== ScreenBreakpoint.lg && w !== ScreenBreakpoint.xl);
    });

    this.searchService.resetSearch$.subscribe(() => {
      this.searchInput.nativeElement.value = '';
    });

    this.testingEnvironment = environment.testing;

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.userHasMoreThanOneAccount = !this.multiAccountsService.hasOneAccount();



    this.getLoggedUser();

    this.guidingTourSubscription = this.guidingTourService.subject.subscribe(data => {
      if (data) {
        this.runGuidingTour = data.showTitle;
      }
    });

    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((respo) => {
      this.impersonationModeIsActivated = respo?.impersonationModeIsActivated;
    });

    if (localStorage.getItem('GuidingTourHome') !== null) {
      this.runGuidingTour = false;
    }
  }

  onSearchChanged(searchValue) {
    if (searchValue?.trim()) {
      this.searchService.resetSearch();
      this.searchService.search(searchValue?.trim());
      this.router.navigateByUrl(`pages/search/result?search=${encodeURIComponent(searchValue?.trim())}`);
    }
  }

  getLoggedUser() {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((respo) => {
      this.username = respo?.displayName;
    });
  }

  goToChangePassword() {
    this.router.navigateByUrl('/pages/edit-profile');
  }

  goToUpdateProfile() {
    this.router.navigateByUrl('/pages/edit-profile');
  }

  logout() {
    this.miscellaneousService.openConfirmModal('Are you sure you want to logout?',
      () => this.accountService.logoutFromAllTabs());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  backToAdministration() {
    this.accountService.impersonateLogout().subscribe((response) => {
      this.tokenService.saveToken(response.body.token);
      this.appComponent.loadCurrentUser(() => {
        this.accountService.triggerStopImpersonate();
        this.router.navigate(['/', 'pages']);
      });
    });
  }

  async showSelectAccountPopup() {
    const accounts = await this._getUserAccounts();

    const selectedAccount = this.multiAccountsService.getSelectedAccount();

    if (selectedAccount !== null)
      this.multiAccountsService.setSelectedAccount(selectedAccount);

    const modelRef = this.modalService.show<SelectAccountComponent>(SelectAccountComponent, {
      initialState: {
        selectedAccount: selectedAccount,
        accounts: accounts
      }
    });

    modelRef.onHidden.subscribe(() => {
      if (!modelRef.content.selectionChangeApplied()) {
        return;
      }

      if (modelRef.content.selectedAccount) {
        this.multiAccountsService.setSelectedAccount(modelRef.content.selectedAccount);
      } else {
        this.multiAccountsService.clearSelectedAccount();
      }

      //Calling notifyPermissionsChanged method will force rebuild side menu
      this.permissionService.notifyPermissionsChanged();
      this.routingService.reloadCurrentRoute();
    });
  }

  private async _getUserAccounts() {
    const user = await this.accountService.loadCurrentUser(this.tokenService.getToken()).toPromise();
    return user?.accounts;
  }
}
