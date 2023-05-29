import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EpicoreIdCellComponent } from '../../../_shared/components/epicore-id-cell/epicore-id-cell.component';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { ICustomerRecord } from '../../../_shared/models/customer-lookup';
import { CustomerParams } from '../../../_shared/models/CustomerParams';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from '../../../services/message.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { CustomerActionsComponent } from './customer-actions/customer-actions.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { StorageConstants } from '../../../_shared/constants';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { HLinkTableCellComponent } from '../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('table') table: Ng2SmartTableComponent;
  hasLogin?: boolean;
  isFavorite?: boolean;
  public Math = Math;
  isLoading = true;
  source: BaseServerDataSource;
  runGuidingTour = true;

  recordsNumber: number;
  originRecordsNumber: string;
  pageSize = 10;
  currentPageIndex = 0;
  pagerPages = 5;
  customers: ICustomerRecord[];
  totalCount: number;
  isSmall?: boolean = null;
  showFilters = false;
  epicorCustomerId: string;
  name: string;
  phone: string;
  fax: string;
  lastLogin?: Date;

  responsiveSubscription: Subscription;

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      epicorCustomerId: {
        title: 'ID',
        type: 'custom',
        renderComponent: EpicoreIdCellComponent,
        onComponentInitFunction: (instance: EpicoreIdCellComponent) => {
          instance.setHeader('ID');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      name: {
        title: 'Name',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Name');
          instance.setOptions({
            tooltip: 'View Account Details',
            link: 'pages/customers-management/customers',
            paramExps: [
              'id'
            ]
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      phone: {
        title: 'Phone',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Phone');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      fax: {
        title: 'Fax',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Fax');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      lastLogin: {
        title: 'Last Login',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Last Login');
        },
        valuePrepareFunction: this.formatUSDateTime.bind(this),
        filter: false
        // filter: {
        //   type: 'custom',
        //   component: CpDateFilterComponent,
        // },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        width: '90px',
        renderComponent: CustomerActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  constructor(
    private router: Router,
    private miscellaneousService: MiscellaneousService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  initializeSource() {
    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getCustomers(params);
    this.source.dataLoading.subscribe((isLoading) => this._onDataLoading(isLoading));
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;
    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'lastLogin') {
      return new Date(value);
    }
    return value;
  }

  private _getCustomers(params: any) {
    // params.pageSize = this.recordsNumber;
    const customerParams = params as CustomerParams;
    customerParams.hasLogin = this.hasLogin;
    customerParams.favoriteCustomer = this.isFavorite;
    if (this.isSmall) {
      this._fillFilterParameters(customerParams);
    }
    customerParams.lastLogin = this.mockUtcDate(customerParams.lastLogin);
    return this.customerService.getCustomers(customerParams);
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
        perPage: this.recordsNumber || 25
    };
  }

  private _fillFilterParameters(customerParams: CustomerParams) {
    customerParams.name = this.name;
    customerParams.epicorCustomerId = this.epicorCustomerId;
    customerParams.phone = this.phone;
    customerParams.fax = this.fax;
    customerParams.lastLogin = this.lastLogin;
  }

  onActionsInit(actions: CustomerActionsComponent) {
    actions.showDetails.subscribe((row) => this.onShowDetails(row));
    actions.manageUsers.subscribe((row) => this.manageUsers(row));
    actions.addToFavorite.subscribe((row) => this.onAddToFavorite(row));
    actions.removeFromFavorite.subscribe((row) => this.onRemoveFromFavorite(row));
  }

  manageUsers(customer: ICustomerRecord) {
    this.router.navigateByUrl(`pages/customers-management/customers/${customer.id}`, {
      state: {
        tab: 'users'
      }
    });
    // const modalRef = this.modalService.show<ManageAdminAccountsComponent>(ManageAdminAccountsComponent, {
    //   initialState: { customer }
    // });
    // const subscription = modalRef.onHidden
    //   .subscribe(() => {
    //     subscription.unsubscribe();
    //      if(!this.miscellaneousService.isImpersonateMode()) {
    //       this.source.refresh();
    //     }
    //   });
  }

  ngOnInit(): void {
    // this.recordsNumber = null;
    this.recordsNumber = environment.recordsPerPage;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe((w) => this._onScreenSizeChanged(w));
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
    if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
      if (this.isSmall !== false) {
        this.onReset();
        this.isSmall = false;
      }
    } else if (w === ScreenBreakpoint.md ||
      w === ScreenBreakpoint.xs ||
      w === ScreenBreakpoint.sm) {
      if (this.isSmall !== true) {
        this.onReset();
        this.isSmall = true;
      }
    }
  }
  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
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
    this.hasLogin = null;
    this.isFavorite = null;
    this.epicorCustomerId = null;
    this.name = null;
    this.phone = null;
    this.fax = null;
    this.lastLogin = null;
  }

  onShowDetails(customer: ICustomerRecord) {
    this.router.navigateByUrl('pages/customers-management/customers/' + customer.id.toString());
    localStorage.setItem(StorageConstants.GENERATEFILE, StorageConstants.GENERATEFILE_VALUE);
  }

  onAddToFavorite(customer: ICustomerRecord) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to add this account to your favorite list?',
      () => {
        this._addToFavorite(customer);
      });
  }

  onRemoveFromFavorite(customer: ICustomerRecord) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to remove this account from your favorite list?',
      () => {
        this._removeFromFavorite(customer);
      });
  }

  _addToFavorite(customer: ICustomerRecord) {
    this.customerService.addToFavorite(customer.id).subscribe(() => {
      this.source.refresh();
      this.messageService.showSuccessMessage('Customer has been added to the favorite list');
    }, (error) => {
      this.source.refresh();
    });
  }

  _removeFromFavorite(customer: ICustomerRecord) {
    this.customerService.removeFromFavorite(customer.id).subscribe(() => {
      this.source.refresh();
      this.messageService.showSuccessMessage('Customer has been removed from the favorite list');
    }, (error) => {
      this.source.refresh();
    });
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onHasLoginChecked(event) {
    if (this.isLoading) {
return;
}
    this.hasLogin = event;
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onIsFavoriteChecked(event) {
    if (this.isLoading) {
return;
}
    this.isFavorite = event;
    this.source.setPage(1, false);
    this.source.refresh();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    const modalCount = this.modalService?.getModalsCount();
    if (modalCount > 0) {
      this.modalService?.hide();
    }
    this.responsiveSubscription?.unsubscribe();

    this.stopGuidingTour();
    this.joyrideService = null;
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourCustomers') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['customerFirstStep'],
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

  onFinishingTour() {
    localStorage.setItem('GuidingTourCustomers', '1');
    this.runGuidingTour = false;
  }
}
