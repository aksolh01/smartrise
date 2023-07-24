import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IJob, IJobResource } from '../../../../_shared/models/job';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../services/job.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { JobTabService } from '../../../../services/job-tabs.service';
import { BaseComponent } from '../../../base.component';
import { Tab } from '../../../../_shared/models/jobTabs';
import { BaseComponentService } from '../../../../services/base-component.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { forkJoin } from 'rxjs';
import { PasscodeService } from '../../../../services/passcode.service';
import { IPasscode } from '../../../../_shared/models/passcode.model';
import { JobBasiicInfoComponent } from './job-basiic-info/job-basiic-info.component';
import { URLs } from '../../../../_shared/constants';
import { PasscodeCellComponent } from './job-basiic-info/passcode-cell/passcode-cell.component';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { ResourceService } from '../../../../services/resource.service';
import { MessageService } from '../../../../services/message.service';

@Component({
  selector: 'ngx-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  jobIsBefore2008: boolean;
  job: IJob;
  isLoading = true;
  isSmartriseUser: boolean;
  displayAccountName: boolean;
  isSmall?: boolean = null;
  shipmentsTabSelected = false;
  resurcesTabSelected = false;
  jobTabSelected = false;
  prevUrl: string;
  passcode: IPasscode;
  @ViewChild('basicInfo') basicInfo: JobBasiicInfoComponent;
  renderJobResources: boolean;
  passcodeSource: LocalDataSource;
  passcodeSettings: any = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      carName: {
        title: 'Car',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Car');
        },
        show: false,
        filter: false,
        sort: false
      },
      passcode: {
        title: 'Passcode',
        type: 'custom',
        renderComponent: PasscodeCellComponent,
        onComponentInitFunction: (instance: PasscodeCellComponent) => {
          instance.setHeader('Passcode');
        },
        show: false,
        filter: false,
        sort: false
      },
    }
  };
  configFile: IJobResource;
  backgroundResourceStatusChecking: NodeJS.Timeout;
  status: string;
  isRequesting: boolean;

  constructor(
    private jobService: JobService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private jobTabService: JobTabService,
    private router: Router,
    private miscellaneousService: MiscellaneousService,
    private multiAccountsService: MultiAccountsService,
    private passcodeService: PasscodeService,
    private resourceService: ResourceService,
    private messageService: MessageService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
    if (this.prevUrl === URLs.TrackingURL || this.prevUrl === URLs.ViewResourcesURL) {
      setTimeout(() => this._scrollTo('bottomContainer'), 500);
    }
  }

  ngOnInit(): void {

    this._initializePasscodeTable();

    this.prevUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    this.displayAccountName = this.isSmartriseUser || this.multiAccountsService.hasMultipleAccounts();

    this.bcService.set('@jobNumber', { skip: true });

    this.loadJob();

    const selectedTab = this.jobTabService.getSelectedTab();

    if (selectedTab === Tab.Shipments) {
      this.shipmentsTabSelected = true;
      this.jobTabSelected = false;
      this.resurcesTabSelected = false;
    } else if (selectedTab === Tab.JobFiles) {
      this.shipmentsTabSelected = false;
      this.jobTabSelected = false;
      this.resurcesTabSelected = true;
    } else if (selectedTab === Tab.JobDetails) {
      this.shipmentsTabSelected = false;
      this.jobTabSelected = true;
      this.resurcesTabSelected = false;
    }
  }

  private _scrollTo(container: string) {
    document.getElementById(container).scrollIntoView({ behavior: "smooth" });
  }

  loadJob() {

    const jobId = +this.activatedRoute.snapshot.paramMap.get('id');

    if (!isFinite(jobId)) {
      this.router.navigateByUrl('pages/jobs-management/jobs');
      return;
    }

    const getJob = this.jobService.getjob(jobId);
    const getPasscode = this.passcodeService.getPasscode(jobId);

    forkJoin([getJob, getPasscode]).subscribe(([job, passcode]) =>
      this._jobDetailsDataReady(job, passcode));
  }

  private _jobDetailsDataReady(job: IJob, passcode: IPasscode) {

    this.passcodeSource = new LocalDataSource(passcode.lines);
    this.passcodeSource.refresh();

    if (this.miscellaneousService.isCustomerUser()) {
      const selectedAccount = this.multiAccountsService.getSelectedAccount();

      if (selectedAccount != null && selectedAccount !== job.primaryCustomerId) {
        this.router.navigateByUrl('pages/jobs-management/jobs');
        return;
      }
    }

    this.job = job;
    this.passcode = passcode;
    this.jobIsBefore2008 = this._jobIsBefore2008(job);
    this._fetchConfigFileFromJobResources();

    if (this.configFile?.status === 'Pending') {
      this._startRefreshPasscode();
    }
    this._formatShipments();

    this.bcService.set('@jobNumber', this.job.jobNumber === '' ? 'N/A' : this.job.jobNumber);
    this.bcService.set('@jobNumber', { skip: false });
    this.isLoading = false;
  }

  private _fetchConfigFileFromJobResources() {
    this.configFile = this.job.resourceFiles.find(rf => rf.resourceType.value === 'ConfigFile');
  }

  private _initializePasscodeTable() {
    const data = this.passcode?.lines ?? [];
    this.passcodeSource = new LocalDataSource(data);
    this.passcodeSource.refresh();
  }

  private _jobIsBefore2008(job: IJob): boolean {
    return new Date(job.orderDate).getFullYear() < 2008;
  }

  private _formatShipments() {
    this.job.shipments.forEach(shipment => {
      shipment.shippingTrackingActions.forEach(action => {
        let actionDateStr = this.formatDateTime(action.actionDate, 'MM/dd/yyyy HH:mm');

        if (shipment.shipmentActionsTimeZone === 'Local') {
          actionDateStr = `${actionDateStr} (Local)`;
        }

        action.actionDateStr = actionDateStr;
      });
    });
  }

  onClose() {
    this.router.navigateByUrl('pages/jobs-management/jobs');
  }

  onChangeTab($event) {
    const tabTitle = $event.tabTitle;

    if (tabTitle === 'Job Files') {
      this.renderJobResources = true;
    }
  }

  onRefresh() {
    this.isLoading = true;
    this.loadJob();
  }

  onRequestPasscode() {

    if (this.configFile?.status === 'Pending' || this.isRequesting) {
      return;
    }

    this.isRequesting = true;
    this.resourceService
      .createRequest({
        jobId: this.job.id,
        resourceFileId: this.configFile.id,
      })
      .subscribe(
        (resp) => this._onRequestPasscodeSucess(),
        (error) => this._onRequestPasscodeError()
      );
  }

  private _onRequestPasscodeError() {
    this.isRequesting = false;
    this._refreshPasscodes();
  }

  private _onRequestPasscodeSucess() {
    this.isRequesting = false;
    this.messageService.showInfoMessage(
      'Please wait until the passcode(s) get updated'
    );
    this._getNewConfigFileStatus();
    this._startRefreshPasscode();
    this._refreshPasscodes();
  }

  private _startRefreshPasscode() {
    if (!this._backgroundResourceStatusCheckingIsActive()) {
      this.backgroundResourceStatusChecking = setInterval(() => {
        this.resourceService.refreshResource(this.configFile).subscribe(
          obj => this._onRefreshConfigFileStatus(obj),
          error => this._endRefreshPasscode()
        );
      }, 10000);
    }
  }

  private _backgroundResourceStatusCheckingIsActive() {
    return typeof this.backgroundResourceStatusChecking !== 'number' && this.backgroundResourceStatusChecking;
  }

  private _refreshPasscodes() {
    this.passcodeService.getPasscode(this.job.id).subscribe(passcode => {
      this.passcode = passcode;
      this._initializePasscodeTable();
    });
    this.resourceService.refreshResource(this.configFile).subscribe(
      obj => this._onRefreshConfigFileStatus(obj),
      error => this._endRefreshPasscode()
    );
    this._startRefreshPasscode();
  }

  private _onRefreshConfigFileStatus(obj: { response: IJobResource; currentResource: IJobResource; }) {
    if (obj.response.status === 'Completed' && obj.response.readyForDownload) {
      this._endRefreshPasscode();
      this._refreshPasscodes();
      this.messageService.showSuccessMessage('Passcode(s) Refreshed Successfully');
    } else if (obj.response.status === 'Failed') {
      this._endRefreshPasscode();
      this.messageService.showErrorMessage('Failed to Refresh Passcode(s)');
    }
    this.configFile = obj.response;
  }

  private _endRefreshPasscode() {
    if (this.backgroundResourceStatusChecking) {
      clearInterval(this.backgroundResourceStatusChecking);
    }
  }

  private _getNewConfigFileStatus() {
    this.resourceService.refreshResource(this.configFile).subscribe(
      obj => this.configFile = obj.response,
    );
  }

  ngOnDestroy(): void {
    this._endRefreshPasscode();
  }
}
