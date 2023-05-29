import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { Observable, Subscription } from 'rxjs';
import { BaseComponentService } from '../../../../services/base-component.service';
import { CustomerService } from '../../../../services/customer.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { searchCompanyInfoParams as SearchCompanyInfoParams } from '../../../../_shared/models/CustomerParams';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../../base.component';
import { CompanyActionInfoComponent } from './company-action-info/company-action-info.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { URLs } from '../../../../_shared/constants';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { BaseParams } from '../../../../_shared/models/baseParams';
import { IPagination } from '../../../../_shared/models/pagination';
import { IBusinessSettings } from '../../../../_shared/models/settings';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-company-info-list',
  templateUrl: './company-info-list.component.html',
  styleUrls: ['./company-info-list.component.scss']
})
export class CompanyInfoListComponent extends BaseComponent implements OnInit, OnDestroy {

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
        renderComponent: CompanyActionInfoComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  constructor(
    private customerService: CustomerService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private joyrideService: JoyrideService,
    baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void {
    this.recordsNumber = environment.recordsPerPage;
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

  onActionsInit(actions: CompanyActionInfoComponent) {
    actions.showDetails.subscribe(id => {
      this.router.navigateByUrl(`${URLs.CompanyInfoURL}/${id.toString()}`);
    });
  }

  initializeSource() {

    this._initializePager();
    this.source = new BaseServerDataSource();

    this.source.serviceCallBack = (params) => this._getCompantInfos(params);

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });

    this.source.setSort([
      { field: 'name', direction: 'asc' }  // primary sort
    ], false);
  }

  private _getCompantInfos(params: BaseParams): Observable<IPagination> {
    const searchParams = params as SearchCompanyInfoParams;

    if (this.isSmall) {
      this._fillFilterParameters(searchParams);
    }

    return this.customerService.searchCompanyInfo(searchParams);
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

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourCompanyInfo') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['companyInfoFirstStep'],
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
    localStorage.setItem('GuidingTourCompanyInfo', '1');
    this.runGuidingTour = false;
  }
}
