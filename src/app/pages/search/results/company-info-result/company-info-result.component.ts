import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Observable, Subscription, tap } from 'rxjs';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { URLs } from '../../../../_shared/constants';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CompanyActionInfoComponent } from '../../../settings-management/company-info/company-info-list/company-action-info/company-action-info.component';
import { CustomerService } from '../../../../services/customer.service';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JoyrideService } from 'ngx-joyride';
import { BaseComponentService } from '../../../../services/base-component.service';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseParams } from '../../../../_shared/models/baseParams';
import { IPagination } from '../../../../_shared/models/pagination';
import { SearchCompanyInfoParams } from '../../../../_shared/models/CustomerParams';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-company-info-result',
  templateUrl: './company-info-result.component.html',
  styleUrls: ['./company-info-result.component.scss']
})
export class CompanyInfoResultComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() searchKey: string;
  showFilters: boolean = false;
  isLoading: boolean = true;
  runGuidingTour: boolean = true;
  recordsNumber: number;
  responsiveSubscription: Subscription;
  isSmall?: boolean = null;
  customerName: string;
  phone: string;
  fax: string;
  email: string;
  source: BaseServerDataSource;

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
      name: {
        title: 'Name',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Name');
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
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
      email: {
        title: 'Primary Shipping Email',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Primary Shipping Email');
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
        renderComponent: ViewDetailsActionComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  constructor(
    private customerService: CustomerService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private joyrideService: JoyrideService,
    private searchService: SearchService,
    baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.recordsNumber = 5;
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

  ngOnDestroy(): void {
    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    this.stopGuidingTour();
    this.joyrideService = null;
  }

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe(data => {
      this.router.navigateByUrl(`${URLs.CompanyInfoURL}/${data.id.toString()}`);
    });
  }

  initializeSource() {

    this._initializePager();
    this.source = new BaseServerDataSource();

    this.source.serviceCallBack = (params) => this._getCompantInfos(params).pipe(
      tap(x => this.searchService.notifyResultSetReady('CompanyInfo', x.data.length)),
      );

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
    });

    this.source.setSort([
      { field: 'name', direction: 'asc' }  // primary sort
    ], false);
  }

  private _getCompantInfos(params: BaseParams): Observable<IPagination> {
    const searchParams = params as SearchCompanyInfoParams;

    this._fillSearchParameters(this.searchKey, searchParams);

    return this.customerService.searchAllCompanyInfo(searchParams);
  }

  private _fillSearchParameters(searchKey: string, searchParams: SearchCompanyInfoParams) {
    searchParams.email = searchKey;
    searchParams.fax = searchKey;
    searchParams.name = searchKey;
    searchParams.phone = searchKey;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _fillFilterParameters(searchParams: SearchCompanyInfoParams) {
    searchParams.name = this.customerName;
    searchParams.phone = this.phone;
    searchParams.fax = this.fax;
    searchParams.email = this.email;
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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
    this.customerName = null;
    this.phone = null;
    this.fax = null;
    this.email = null;
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourCompanyInfo', '1');
    this.runGuidingTour = false;
  }
}
