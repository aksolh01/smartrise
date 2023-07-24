import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IRecentJob } from '../../../_shared/models/job';
import { Tab } from '../../../_shared/models/jobTabs';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { JobTabService } from '../../../services/job-tabs.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { MiscellaneousService } from '../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-recent-jobs',
  templateUrl: './recent-jobs.component.html',
  styleUrls: ['./recent-jobs.component.scss']
})
export class RecentJobsComponent extends BaseComponent implements OnInit {

  isSmall?: boolean = null;
  responsiveSubscription: Subscription;

  @Input() isLoading: boolean;
  @Input() displayCustomerName: boolean;
  @Input() data: IRecentJob[];
  isSmartrise: boolean;

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private readonly jobTabService: JobTabService,
    private readonly miscellaneousService: MiscellaneousService,
    private readonly responsiveService: ResponsiveService) {
      super(baseService);
    }

  ngOnInit(): void {

    this.isSmartrise = this.miscellaneousService.isSmartriseUser();

    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
  }

  goToJobDetail(jobId: number) {
    this.jobTabService.setSelectedTab(Tab.JobDetails);
    this.router.navigateByUrl(`pages/jobs-management/jobs/${jobId}`);
  }
}
