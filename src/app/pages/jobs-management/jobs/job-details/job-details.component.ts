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

  shipmentsTabSelected = false;
  resurcesTabSelected = false;
  jobTabSelected = false;
  renderJobResources = false;
  prevUrl: string;

  constructor(
    private jobService: JobService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private jobTabService: JobTabService,
    private router: Router,
    private miscellaneousService: MiscellaneousService,
    private multiAccountsService: MultiAccountsService,
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

    this.jobService
      .getjob(jobId)
      .subscribe(
        (response) => {

          if (this.miscellaneousService.isCustomerUser()) {
            const selectedAccount = this.multiAccountsService.getSelectedAccount();

            if (selectedAccount != null && selectedAccount !== response.customerId) {
              this.router.navigateByUrl('pages/jobs-management/jobs');
              return;
            }
          }

          this.job = response;

          this.job.shipments.forEach(shipment => {
            shipment.shippingTrackingActions.forEach(action => {
              let actionDateStr = this.formatDateTime(action.actionDate, 'MM/dd/yyyy HH:mm');

              if (shipment.shipmentActionsTimeZone === 'Local') {
                actionDateStr = `${actionDateStr} (Local)`;
              }

              action.actionDateStr = actionDateStr;
            });
          });

          this.bcService.set('@jobNumber', this.job.jobNumber === '' ? 'N/A' : this.job.jobNumber);
          this.bcService.set('@jobNumber', { skip: false });
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.router.navigateByUrl('pages/jobs-management/jobs');
        }
      );
  }

  onChangeTab($event) {
    const tabTitle = $event.tabTitle;

    if (tabTitle === 'Job Files') {
      this.renderJobResources = true;
    }
  }

  onClose() {
    this.router.navigateByUrl(this.prevUrl);
  }

  onRefresh() {
    this.isLoading = true;
    this.loadJob();
  }
}
