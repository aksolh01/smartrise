import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbLayoutScrollService, NbSidebarService } from '@nebular/theme';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';
import { AccountService } from '../../../services/account.service';
import { GuidingTourService } from '../../../services/guiding.tour.service';
import { PortalTitleService } from '../../../services/portal.title.service';
import {
  ResponsiveService
} from '../../../services/responsive.service';
import { ScrollingService } from '../../../services/scrolling.servive';
import { SelectHelperService } from '../../../services/select-helper.service';
import { IUser } from '../../../_shared/models/IUser';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column-layout.html',
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {

  portalTitle = '';

  scrollDisabled = false;
  user: IUser = null;
  currentUser$: Observable<IUser>;
  impersonationModeIsActivated = false;
  runGuidingTour = true;
  guidingTourSubscription: Subscription;
  private _canHideOverlays = true;

  constructor(
    private _sidebarService: NbSidebarService,
    private _layoutService: LayoutService,
    private _router: Router,
    private _rs: ResponsiveService,
    private _accountService: AccountService,
    private guidingTourService: GuidingTourService,
    private readonly _portalTitleService: PortalTitleService,
    private scService: NbLayoutScrollService,
    private scrollService: ScrollingService,
    private selectHelperService: SelectHelperService
  ) {
  }

  onScroll(event) {
    if (this._canHideOverlays) {
      this.scService.fireScrollChange(event);
    } else {
      this._canHideOverlays = true;
    }
  }

  ngOnInit(): void {
    this.scrollService.scrollStatusChanged.subscribe((enable) => {
      this.scrollDisabled = enable;
    });
    this.selectHelperService.allowOnScroll.subscribe((preventOnScroll) => {
      this._canHideOverlays = preventOnScroll;
    });
    this.guidingTourSubscription = this.guidingTourService.subject.subscribe(data => {
      if (data) {
        this.runGuidingTour = data.showTitle;
      }
    });

    if (localStorage.getItem('GuidingTourHome') !== null) {
      this.runGuidingTour = false;
    }

    this.currentUser$ = this._accountService.currentUser$;
    this.currentUser$.subscribe((user) => {
      this.impersonationModeIsActivated = user?.impersonationModeIsActivated;
      this.portalTitle = this._portalTitleService.getPortalTitleService(user);

      // `user.email !== this.user.email` to fix bug 9412
      if (user && this.user && user.email !== this.user.email) {
        this._router.navigateByUrl('pages/dashboard');
      }

      this.user = user;
    });

    combineLatest([
      this._rs.currentBreakpoint$,
      this._router.events.pipe(filter((m) => m instanceof NavigationEnd)),
    ]).subscribe(([bp]: [ScreenBreakpoint, NavigationEnd]) => {
      if (
        bp === ScreenBreakpoint.xs ||
        bp === ScreenBreakpoint.sm ||
        bp === ScreenBreakpoint.md
      ) {
        this._sidebarService.collapse('menu-sidebar');
        this._layoutService.changeLayoutSize();
      } else if (bp === ScreenBreakpoint.lg) {
        this._sidebarService.compact('menu-sidebar');
        this._layoutService.changeLayoutSize();
      }
    });
  }

  onFinishingHomeTour() {
    this.guidingTourService.finishHomePageTour();
  }

  toggleSidebar(): boolean {
    this._sidebarService.toggle(true, 'menu-sidebar');
    this._layoutService.changeLayoutSize();

    return false;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.guidingTourSubscription.unsubscribe();
    this.user = null;
  }
}
