import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { ICustomerRecord } from '../../../../_shared/models/customer-lookup';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { Subscription, tap } from 'rxjs';
import { EpicoreIdCellComponent } from '../../../../_shared/components/epicore-id-cell/epicore-id-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CustomerActionsComponent } from '../../../customers-management/customers/customer-actions/customer-actions.component';
import { Router } from '@angular/router';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { CustomerService } from '../../../../services/customer.service';
import { MessageService } from '../../../../services/message.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { BaseComponentService } from '../../../../services/base-component.service';
import { CustomerParams } from '../../../../_shared/models/CustomerParams';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { StorageConstants } from '../../../../_shared/constants';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-accounts-result',
  templateUrl: './accounts-result.component.html',
  styleUrls: ['./accounts-result.component.scss']
})
export class AccountsResultComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
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
  @Input() searchKey: string;
  responsiveSubscription: Subscription;

  settings: any = {
    hideSubHeader: true,
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
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        width: '90px',
        renderComponent: ViewDetailsActionComponent,
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
    private searchService: SearchService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  initializeSource() {
    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getCustomers(params).pipe(
      tap(x => this.searchService.notifyResultSetReady('Accounts', x.data.length)),
      );
    this.source.dataLoading.subscribe((isLoading) => this._onDataLoading(isLoading));
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'lastLogin') {
      return new Date(value);
    }
    return value;
  }

  private _getCustomers(params: any) {
    const customerParams = params as CustomerParams;
    this._fillSearchParameters(this.searchKey, customerParams);
    return this.customerService.searchAllCustomers(customerParams);
  }

  private _fillSearchParameters(searchKey: string, customerParams: CustomerParams) {
    customerParams.epicorCustomerId = searchKey;
    customerParams.fax = searchKey;
    customerParams.phone = searchKey;
    customerParams.name = searchKey;
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

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe((row) => this.onShowDetails(row));
  }

  manageUsers(customer: ICustomerRecord) {
    this.router.navigateByUrl(`pages/customers-management/customers/${customer.id}`, {
      state: {
        tab: 'users'
      }
    });
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.recordsNumber = 5;
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
  }
}
