import { Component, OnInit } from '@angular/core';
import { IJob } from '../../../../_shared/models/job';
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
import { URLs } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent extends BaseComponent implements OnInit {

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

  constructor(
    private jobService: JobService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private jobTabService: JobTabService,
    private router: Router,
    private miscellaneousService: MiscellaneousService,
    private multiAccountsService: MultiAccountsService,
    private passcodeService: PasscodeService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnInit(): void {

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
    if (this.miscellaneousService.isCustomerUser()) {
      const selectedAccount = this.multiAccountsService.getSelectedAccount();
      
      if (selectedAccount != null && selectedAccount !== job.primaryCustomerId) {
        this.router.navigateByUrl('pages/jobs-management/jobs');
        return;
      }
    }

    this.job = job;
    this.passcode = passcode;
    //this.passcode.passcode = this._isEmpty(this.passcode.passcode) ? '&nbsp;' : this.passcode.passcode;

    this._formatShipments();

    this.bcService.set('@jobNumber', this.job.jobNumber === '' ? 'N/A' : this.job.jobNumber);
    this.bcService.set('@jobNumber', { skip: false });
    this.isLoading = false;
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

  onRefresh() {
    this.isLoading = true;
    this.loadJob();
  }
}
