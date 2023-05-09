import { ChangeDetectorRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tab } from '../../../../_shared/models/jobTabs';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../../services/base-component.service';
import { JobTabService } from '../../../../services/job-tabs.service';
import { MessageService } from '../../../../services/message.service';
import { ResourceService } from '../../../../services/resource.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-latest-uploaded-files-item',
  templateUrl: './latest-uploaded-files-item.component.html',
  styleUrls: ['./latest-uploaded-files-item.component.scss']
})
export class LatestUploadedFilesItemComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() file: any;
  @Input() displayCustomerName = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  isSmall?: boolean = null;
  isDownloading = false;
  isCollapsed = true;

  collapseShowTooltip = 'Show Details';

  responsiveSubscription: Subscription;
  isOtherType: any;

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private jobTabServive: JobTabService,
    private readonly resourceService: ResourceService,
    private readonly messageService: MessageService,
    private readonly responsiveService: ResponsiveService,
    private readonly _changeDetectorRef: ChangeDetectorRef) {
    super(baseService);
  }

  ngOnInit(): void {
    this.isOtherType = this.file?.resourceType?.value === 'Other';
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

  goToFileDetail() {
    this.jobTabServive.setSelectedTab(Tab.JobFiles);
    this.router.navigateByUrl(`pages/jobs-management/jobs/${this.file.jobId}`);
  }

  downloadFile() {
    this._enableDownloadButton();
    this._download();
  }

  _download() {
    // const startSownloadSubscription = this.resourceService.downloadStatus.subscribe(s => {
    //   if (s.status === ProgressStatusEnum.START) {
    //     startSownloadSubscription.unsubscribe();
    //   }
    // });
    // const completeDownloadSubscription = this.resourceService.downloadStatus.subscribe(s => {
    //   if (s.status === ProgressStatusEnum.COMPLETE) {
    //     this.messageService.showSuccessMessage('File has been downloaded successfully');
    //     this._disableDownloadButton();
    //     completeDownloadSubscription.unsubscribe();
    //   }
    // });
    // const errorSubscription = this.resourceService.downloadStatus.subscribe(s => {
    //   if (s.status === ProgressStatusEnum.ERROR) {
    //     this._disableDownloadButton();
    //     this.messageService.showError(s.error);
    //     errorSubscription.unsubscribe();
    //     this.refresh.emit(null);
    //   }
    // });

    let modalRef: any;
    this.resourceService.validateDownloadResource(this.file.resourceFileId).subscribe(() => {
      this.resourceService.downloadResourceFile(
        this.file.resourceFileId,
        {
          successCallBack: (e) => {
            this._disableDownloadButton();
            this.messageService.showSuccessMessage('File has been downloaded successfully');
          },
          errorCallback: (e) => {
            this._disableDownloadButton();
            this.messageService.showSuccessMessage('File has been downloaded successfully');
          },
          finallyCallback: () => {
            this._disableDownloadButton();
          },
        },
        true
      );
    }, error => {
      this.refresh.emit(null);
    });
  }

  _enableDownloadButton() {
    this._changeDetectorRef.markForCheck();
    this.isDownloading = true;
  }

  _disableDownloadButton() {
    this._changeDetectorRef.markForCheck();
    this.isDownloading = false;
  }

  onShowHide() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseShowTooltip = this.isCollapsed ? 'Show Details' : 'Hide Details';
  }

  ngOnDestroy(): void {
    this.resourceService.dispose();
  }
}
