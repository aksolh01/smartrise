import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { AccountTableCellComponent } from '../../../_shared/components/account-table-cell/account-table-cell.component';
import { URLs } from '../../../_shared/constants';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { BaseComponent } from '../../base.component';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../services/account-info.service';
import { ListTitleService } from '../../../services/list-title.service';
import { PasscodeService } from '../../../services/passcode.service';
import { MessageService } from '../../../services/message.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { PartService, PartTabService } from '../../../services/part.service';
import { PartActionsComponent } from './part-actions/part-actions.component';
import { PartSearchParams } from '../../../_shared/models/part.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { HLinkTableCellComponent } from '../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { YesNoCellComponent } from '../../../_shared/components/yes-no-cell.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../_shared/components/pager/pager.component';

@Component({
  selector: 'ngx-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.scss']
})
export class PartsListComponent extends BaseComponent implements OnInit, AfterViewInit {
  recordsNumber: number;
  @ViewChild('search') search: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading: boolean = true;
  isSmall?: boolean = null;
  showFilters: boolean = false;
  runGuidingTour: boolean = true;
  actualShipDate?: Date;
  installedBy: string;
  maintainedBy: string;
  account: string;
  partNumber: string;
  partsListTitle: string;
  yesNoList: { value?: boolean; title: string }[];

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      partNumber: {
        title: 'Part Number',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Part Number');
          instance.setOptions({
            tooltip: 'View Part Details',
            link: URLs.ViewPartsURL,
            paramExps: [
              'id',
              '#view'
            ]
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      modelNumber: {
        title: 'Model Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Model Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      description: {
        title: 'Description',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Description');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      price: {
        title: 'Price',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Price');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      inactiveFlag: {
        title: 'Inactive',
        type: 'custom',
        renderComponent: YesNoCellComponent,
        onComponentInitFunction: (instance: YesNoCellComponent) => {
          instance.setHeader('Inactive');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: PartActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  responsiveSubscription: Subscription;

  source: BaseServerDataSource;
  price?: number;
  modelNumber: string;
  description: string;
  inactiveFlag?: boolean;

  constructor(
    private accountService: AccountService,
    private partService: PartService,
    private router: Router,
    private responsiveService: ResponsiveService,
    private settingService: SettingService,
    private partTabService: PartTabService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    private listTitleService: ListTitleService,
    private passcodeService: PasscodeService,
    private messageService: MessageService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  onActionsInit(actions: PartActionsComponent) {
    actions.showDetails.subscribe(id => this._showPartDetails(id));
  }

  private _showPartDetails(id: any) {
    //this.partTabService.setSelectedTab(Tab.PartDetails);
    this.router.navigateByUrl(`pages/parts-management/parts/${id}/view`);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 500);
  }

  initializeSource() {

    this._initializePager();

    this.source = new BaseServerDataSource();

    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getParts(params);

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });

    this.source.setSort([
      { field: 'partName', direction: 'asc' }  // primary sort
    ], false);
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'epicorWaitingInfo')
      return (/true/i).test(value);

    if (field === 'orderDate' || field === 'createDate' || field === 'shipDate' || field === 'grantedShipDate')
      return new Date(value);

    return value;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber
    };
  }

  private _getParts(params: any) {
    const partParams = params as PartSearchParams;

    if (this.isSmall) {
      this._fillFilterParameters(partParams);
    }

    this._mockDateParameters(partParams);

    return this.partService.getParts(partParams);
  }

  private _mockDateParameters(partParams: PartSearchParams) {
  }

  private _fillFilterParameters(partParams: PartSearchParams) {
    partParams.partNumber = this.partNumber;
    partParams.modelNumber = this.modelNumber;
    partParams.price = this.price;
    partParams.description = this.description;
    partParams.inactiveFlag = this.inactiveFlag;
  }

  async ngOnInit() {
    this.partsListTitle = await this.listTitleService.buildTitle('Parts');
    this.settingService.getBusinessSettings().subscribe((rep) => this._onBusinessSettingsReady(rep));

    this.yesNoList = this.populateYesNo();
  }

  private _onBusinessSettingsReady(rep: IBusinessSettings) {
    this.recordsNumber = rep.numberOfRecords;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
    if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
      if (this.isSmall !== false) {
        this.onReset();
        this.isSmall = false;
      }
    } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
      if (this.isSmall !== true) {
        this.onReset();
        this.isSmall = true;
      }
    }
  }

  onPartFilterChange() { }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEdit(event) {
    this.router.navigateByUrl('pages/parts-management/parts/' + event.data.id);
  }

  onReset() {
    this._resetFilterParameters();
    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  private _resetFilterParameters() {
    this.partNumber = null;
    this.modelNumber = null;
    this.description = null;
    this.price = null;
    this.inactiveFlag = null;
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onLoad(value: any) {
    console.log(value);
  }

  onCustom(event) {
    if (event.action === 'view') {
      this.router.navigateByUrl('pages/parts-management/parts/' + event.data.id.toString());
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }
    this.modalService?.hide();

    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourParts') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['partFirstStep'],
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText
        }
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  ngAfterContentInit(): void {

  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourParts', '1');
    this.runGuidingTour = false;
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }
}
