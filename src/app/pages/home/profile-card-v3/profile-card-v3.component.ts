import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { InfoDialogData } from '../../../_shared/components/info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../../../_shared/components/info-dialog/info-dialog.component';
import { IUser, IUserAccountLookup } from '../../../_shared/models/IUser';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { AccountService } from '../../../services/account.service';
import { GuidingTourService } from '../../../services/guiding.tour.service';
import { ImageService } from '../../../services/image.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { TokenService } from '../../../services/token.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-profile-card-v3',
  templateUrl: './profile-card-v3.component.html',
  styleUrls: ['./profile-card-v3.component.scss']
})
export class ProfileCardV3Component implements OnInit, OnDestroy, AfterContentInit {
  @Input() user: IUser;
  @Input() isLoading = true;

  @Output() restartGuidingTour: EventEmitter<any> = new EventEmitter();

  subscription: Subscription;
  guidingTourSubscription: Subscription;
  responsiveSubscription: Subscription;

  imageToShow: any = null;
  refernceUrl = '/assets/profile-placeholder.png';
  modelRef: any;

  runGuidingTour = true;
  isSmall?: boolean = null;
  impersonationModeIsActivated?: boolean = null;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private imageService: ImageService,
    private modalService: BsModalService,
    private _guidingTourService: GuidingTourService,
    private readonly responsiveService: ResponsiveService,
    private readonly accountService: AccountService,
    private readonly miscellaneousService: MiscellaneousService
  ) { }

  ngOnInit(): void {
    this.subscription = this.accountService.stopImpersonate$.subscribe((user: IUser) => {
      this._loadUserData();
    });

    this.guidingTourSubscription = this._guidingTourService.subject.subscribe(data => {
      if (data) {
        this.runGuidingTour = data.showTitle;
      }
    });

    this._loadUserData();
  }

  goToEditProfilePage() {
    this.router.navigateByUrl('/pages/edit-profile');
  }

  _loadUserData() {
    this.impersonationModeIsActivated = this.user.impersonationModeIsActivated;

    this.getImageFromService(this.user.userProfileInfo?.profilePhoto?.photoGuid);
  }

  ngOnDestroy(): void {
    if (this.modelRef !== null && this.modelRef !== undefined) {
this.modelRef.hide();
}

    if (this.guidingTourSubscription) {
      this.guidingTourSubscription.unsubscribe();
    }
  }

  ngAfterContentInit(): void {
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe((w) => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (
        w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
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

  getImageFromService(photoGuid: string) {
    if (photoGuid) {
      this.imageService.getImage(photoGuid).subscribe(
        (data) => {
          this.createImageFromBlob(data);
        },
        (error) => {
          this.imageToShow = this.refernceUrl;
        }
      );
    } else {
      this.imageToShow = this.refernceUrl;
    }
  }

  logout() {
    this.accountService.logoutFromAllTabs();
  }

  openUserPrivileges() {

    const isSmartriseUser = this.user.isSmartriseUser;

    const dialogData: InfoDialogData = {
      title: `User Privileges`,
      content: isSmartriseUser ? this._getSmartrisePrivilages(this.user.accounts) : this._getAccountUserPrivilagesGroupedByAccount(this.user.accounts),
      dismissButtonLabel: 'Close',
      showDismissButton: true,
      showAsBulltes: true,
    };
    this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: dialogData
    });
  }

  private _getSmartrisePrivilages(accounts: IUserAccountLookup[]): string | string[] | { title: string; list: string[]; }[] {
    return accounts[0].privileges;
  }

  private _getAccountUserPrivilagesGroupedByAccount(accounts: IUserAccountLookup[]): { title: string; list: string[]; }[] {
    accounts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    accounts.forEach(account => {
      account.privileges.sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));
    });
    return accounts.map(account => {
      return { title: account.name, list: account.privileges };
    });
  }

  onFinishingTour() {
    this._guidingTourService.finishHomePageTour();
  }

  onRestartGuidingTour() {
    this.restartGuidingTour.emit(null);
  }
}
