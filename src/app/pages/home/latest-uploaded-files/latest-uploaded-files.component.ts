import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { SortDirection } from '../../../_shared/models/enums';
import { IJobFile } from '../../../_shared/models/job';
import { Tab } from '../../../_shared/models/jobTabs';
import { ResourceByCustomerUserParams, ResourceParams } from '../../../_shared/models/resourceParams';
import { BaseComponentService } from '../../../services/base-component.service';
import { JobTabService } from '../../../services/job-tabs.service';
import { MessageService } from '../../../services/message.service';
import { ResourceService } from '../../../services/resource.service';
import { BaseComponent } from '../../base.component';
import { JobFilesListActionsComponent } from '../../jobs-management/job-files/job-files-list/job-files-list-actions/job-files-list-actions.component';
import { LatestFilesActionsComponent } from './latest-files-actions/latest-files-actions.component';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { BaseParams } from '../../../_shared/models/baseParams';
import { Observable } from 'rxjs';
import { IPagination } from '../../../_shared/models/pagination';

@Component({
  selector: 'ngx-latest-uploaded-files',
  templateUrl: './latest-uploaded-files.component.html',
  styleUrls: ['./latest-uploaded-files.component.scss']
})
export class LatestUploadedFilesComponent extends BaseComponent implements OnInit, OnDestroy {

  isSmartriseUser = false;
  isLoading = true;

  jobFiles: IJobFile[] = null;
  source: BaseServerDataSource;

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private jobTabServive: JobTabService,
    private readonly resourceService: ResourceService,
    private readonly messageService: MessageService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService) {
    super(baseService);
  }


  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      customerName: {
        sort: false,
        title: 'Account',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account');
        },
      },
      jobName: {
        sort: false,
        title: 'Job Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Name');
        },
      },
      jobNumber: {
        sort: false,
        title: 'Job Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Number');
        },
      },
      resourceType: {
        sort: false,
        title: 'File Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('File Type');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
      },
      fileDescription: {
        sort: false,
        title: 'File Description',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('File Description');
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: LatestFilesActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
    hideSubHeader: true,
  };

  ngOnInit(): void {
    this.source = new BaseServerDataSource();
    this.source.serviceCallBack = (params) => this._getLastUploadedFiles(params);

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
    });
    this.source.setPage(1, true);
  }

  private _getLastUploadedFiles(params: BaseParams): Observable<IPagination> {
    const options = params as ResourceParams;
    
    this._fillFilterParameters(options);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.resourceService.getLatestUploadedFilesBySmartriseUser(options);
    } else {
      const searchParams = options as ResourceByCustomerUserParams;
      searchParams.customerId = this.multiAccountService.getSelectedAccount();

      return this.resourceService.getLatestUploadedFilesByCustomerUser(searchParams);
    }
  }

  private _fillFilterParameters(options: ResourceParams) {
    options.pageIndex = 1;
    options.pageSize = 5;
    options.sort = 'uploadedAt';
    options.hasUploadedFile = true;
    options.sortDirection = SortDirection.Desc;
  }

  onActionsInit(actions: JobFilesListActionsComponent) {
    actions.download.subscribe(resource => {
      this.onDownload(resource, actions);
    });
    actions.viewDetails.subscribe(resource => {
      this.onViewDetails(resource);
    });
  }

  onDownload(resource: any, actions: JobFilesListActionsComponent) {
    this.resourceService.validateDownloadResource(resource.resourceFileId).subscribe(() => {
      this.resourceService.downloadResourceFile(
        resource.resourceFileId,
        {
          startCallback: (e) => actions.disableDownloadFile(),
          errorCallback: (e) => {
            actions.enableDownloadFile();
            this.messageService.showError(e.error);
          },
          successCallBack: (e) => {
            this.messageService.showSuccessMessage('File has been downloaded successfully');
            actions.enableDownloadFile();
            this.source.refresh();
          },
          finallyCallback: () => {
            actions.enableDownloadFile();
          },
        },
      );
    }, error => {
      this.source.refresh();
    });
  }

  onViewDetails(resource: any) {
    this.jobTabServive.setSelectedTab(Tab.JobFiles);
    this.router.navigateByUrl('pages/jobs-management/jobs/' + resource.jobId);
  }

  ngOnDestroy(): void {
    this.resourceService.dispose();
  }
}
