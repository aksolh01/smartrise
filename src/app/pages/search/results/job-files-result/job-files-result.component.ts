import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { Observable, Subscription, tap } from 'rxjs';
import { IConsolidatedResource, TaskStatus } from '../../../../_shared/models/job';
import { BaseComponentService } from '../../../../services/base-component.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../../../services/resource.service';
import { MessageService } from '../../../../services/message.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JoyrideService } from 'ngx-joyride';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PermissionService } from '../../../../services/permission.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { CommonValues, PERMISSIONS, TaskStatusConstants, URLs } from '../../../../_shared/constants';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { InformativeCellComponentComponent } from '../../../../_shared/components/informative-cell-component/informative-cell-component.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { ResourceTaskStatusCellComponent } from '../../../../_shared/components/business/status.component';
import { JobFilesListActionsComponent } from '../../../jobs-management/job-files/job-files-list/job-files-list-actions/job-files-list-actions.component';
import { ResourceByCustomerUserParams, ResourceParams } from '../../../../_shared/models/resourceParams';
import { FileUploaderComponent } from '../../../jobs-management/job-files/file-uploader/file-uploader.component';
import { HttpEventType } from '@angular/common/http';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-job-files-result',
  templateUrl: './job-files-result.component.html',
  styleUrls: ['./job-files-result.component.scss']
})
export class JobFilesResultComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  @Input() searchKey: string;
  recordsNumber: number;
  title: string;
  public Math = Math;
  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  isSmartriseUser = false;
  isSmall?: boolean = null;
  showFilters = false;
  public source: BaseServerDataSource;
  runGuidingTour = true;

  account: string;
  jobName: string;
  jobNumber: string;
  resourceType: string;
  status: string;
  message: string;
  fileDescription: string;

  statuses: IEnumValue[] = [];
  // resourceTypes: ITextValueLookup[] = [];
  hasUploadedFile?: boolean;
  responsiveSubscription: Subscription;
  res$: Observable<IConsolidatedResource>;
  backgroundCall: NodeJS.Timeout;
  modelRef: any;
  resourceTypes: IEnumValue[];
  isImpersonateMode: boolean;
  canManageFiles: boolean;
  canGenerateFile: boolean;
  installedBy: string;
  maintainedBy: string;
  selectedAccountName = this.multiAccountService.getSelectedAccountName();

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private resourceService: ResourceService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private modalService: BsModalService,
    private permissionService: PermissionService,
    private multiAccountService: MultiAccountsService,
    private searchService: SearchService,
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 500);
  }

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
      account: {
        title: 'Account',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader(this._getAccountTitle());
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
            paramExps: [
              'id'
            ]
          });
        },
        width: '15%',
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      installedBy: {
        title: 'Installation By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Installation By');
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
            paramExps: [
              'id'
            ]
          });
        },
        width: '15%',
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      maintainedBy: {
        title: 'Currently Maintained By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Currently Maintained By');
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
            paramExps: [
              'id'
            ]
          });
        },
        width: '15%',
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.preNavigateFunction = () => {
          };
          instance.setHeader('Job Name');
          instance.setOptions({
            tooltip: 'View Job Details',
            link: 'pages/jobs-management/jobs',
            paramExps: ['jobId'],
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      jobNumber: {
        title: 'Job Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      resourceType: {
        title: 'File Type',
        type: 'custom',
        renderComponent: InformativeCellComponentComponent,
        onComponentInitFunction: (
          instance: InformativeCellComponentComponent
        ) => {
          instance.generateTooltipContent = (rowData) =>
            rowData['fileDescription'];
          instance.showInfoIconFunction = (rowData) =>
            rowData['resourceType'].value === 'Other' && !this.canManageFiles;
          instance.setHeader('File Type');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      fileDescription: {
        title: 'File Description',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('File Description');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      status: {
        title: 'Status',
        type: 'custom',
        renderComponent: ResourceTaskStatusCellComponent,
        onComponentInitFunction: (
          instance: ResourceTaskStatusCellComponent
        ) => {
          instance.setHeader('Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      actionsCol: {
        width: '15%',
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: ViewDetailsActionComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  initializeSource() {

    this._initializePager();

    this.isImpersonateMode = this.miscellaneousService.isImpersonateMode();
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    if (!this.isSmartriseUser) {
      delete this.settings.columns.status;
    }

    this.settings.columns.account.title = this._getAccountTitle();

    if (this.miscellaneousService.isCustomerUser()) {
      delete this.settings.columns.maintainedBy;
      delete this.settings.columns.installedBy;
      if (this.multiAccountService.hasOneAccount()) {
        delete this.settings.columns.account;
      }
    }

    if (!this.canManageFiles) {
      delete this.settings.columns.fileDescription;
    }

    this._fillTableFilterLists();

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);

    this.source.serviceCallBack = (params) => this._getJobFiles(params).pipe(tap(x => this.searchService.notifyResultSetReady('JobFiles', x.data.length)));
    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;

      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
    this.source.setSort(
      [
        { field: 'jobName', direction: 'asc' }, // primary sort
      ],
      false
    );
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'epicorWaitingInfo') return /true/i.test(value);

    if (
      field === 'orderDate' ||
      field === 'createDate' ||
      field === 'shipDate' ||
      field === 'grantedShipDate'
    )
      return new Date(value);

    return value;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };
  }

  private _fillTableFilterLists() {
    this.settings.columns.resourceType.filter.config.list = this.resourceTypes.map(x => {
      return { title: x.description, value: x.value };
    });
    if (this.settings.columns.status) {
      this.settings.columns.status.filter.config.list = this.statuses.map(x => {
        return { title: x.description, value: x.value };
      });
    }
  }

  private _getJobFiles(params: any) {
    const resourceParams = params as ResourceParams;

    if (!this.isSmartriseUser)
      resourceParams.hasUploadedFile = true;

    this._fillSearchParameters(this.searchKey, resourceParams);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.resourceService.searchAllConsolidateResourcesBySmartriseUser(resourceParams);
    } else {
      return this.resourceService.searchAllConsolidateResourcesByCustomerUser(resourceParams);
    }
  }

  private _fillSearchParameters(searchKey: string, resourceParams: ResourceParams) {
    resourceParams.account = searchKey;
    resourceParams.customerMessage = searchKey;
    resourceParams.fileDescription = searchKey;
    resourceParams.installedBy = searchKey;
    resourceParams.maintainedBy = searchKey;
    resourceParams.message = searchKey;
    resourceParams.jobName = searchKey;
    resourceParams.jobNumber = searchKey;
    resourceParams.status = searchKey;
    resourceParams.resourceType = searchKey;
  }

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe((resource) => {
      this.onViewDetails(resource);
    });
  }

  private _onUploadingFile(data: any): void {
    const modalRef = this.modalService.show<FileUploaderComponent>(
      FileUploaderComponent
    );
    const subscription = modalRef.content.upload.subscribe((uploadData) => {
      if (this.isAllowedFileType(uploadData.file.name)) {
        const size = uploadData.file.size / 1024 / 1024;
        if (size > 10) {
          this.messageService.showErrorMessage(
            'File size cannot be more than 10 MB'
          );
          return;
        }
        subscription.add(
          this.resourceService
            .validateUploadFile(data.resourceFileId)
            .subscribe(
              (r) => {
                subscription.add(
                  this.resourceService
                    .uploadFile(
                      uploadData.file,
                      data.resourceFileId,
                      uploadData.fileDescription
                    )
                    .subscribe(
                      (event) => {
                        switch (event.type) {
                          case HttpEventType.Sent:
                            modalRef.content.isUploading = true;
                            break;
                          case HttpEventType.ResponseHeader:
                            modalRef.content.isUploading = false;
                            break;
                          case HttpEventType.UploadProgress:
                            modalRef.content.progress = Math.round(
                              (event.loaded / event.total) * 100
                            );
                            break;
                          case HttpEventType.Response:
                            this.messageService.showSuccessMessage(
                              'File has been uploaded successfully'
                            );
                            this.source.refresh();
                            modalRef.hide();
                            break;
                        }
                      },
                      (error) => {
                        this.messageService.showError(error);
                        this.source.refresh();
                        modalRef.content.resetUpload();
                      }
                    )
                );
              },
              (error) => {
                this.source.refresh();
              }
            )
        );
      } else {
        this.messageService.showErrorMessage('This file type is not allowed');
        modalRef.content.isUploading = false;
      }
    });

    subscription.add(
      modalRef.onHidden.subscribe(() => {
        subscription.unsubscribe();
      })
    );
  }

  onRemoveUploadedFile(f: any) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to remove the uploaded file?',
      () => this._removeUploadedFile(f)
    );
  }
  isAllowedFileType(fileType: string) {
    const types = ['.pdf', '.zip'];
    for (const key in types) {
      if (fileType.toLowerCase().lastIndexOf(types[key]) > -1) {
        return true;
      }
    }
    return false;
  }

  private _removeUploadedFile(f: any) {
    this.resourceService.removeUploadedFile(f.resourceFileId).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'File has been removed successfully'
        );
        this.source.refresh();
      },
      (error) => {
        this.source.refresh();
      }
    );
  }

  onRefreshResourceV2(resource: any) {
    this.resourceService.refreshConsolidatedResource(resource).subscribe(
      (response) => {
        if (response.newResource.status.value === TaskStatusConstants.Failed) {
          this.messageService.showErrorMessage(
            `Fail to generate '${response.newResource.resourceType.description}' Job File`
          );
        } else if (
          response.newResource.status.value === TaskStatusConstants.Completed
        ) {
          this.messageService.showSuccessMessage(
            `'${response.newResource.resourceType.description}' Job File has been generated successfully`
          );
        }
        const oldRecord = this.source.pagination.data.find(
          (x) => x.resourceFileId === resource.resourceFileId
        );
        if (oldRecord) {
          this.source.updateRecord(oldRecord, response.newResource);
        }
      },
      () => { }
    );
  }

  onRefreshResource(resource: any, actions: JobFilesListActionsComponent) {
    this.resourceService.refreshConsolidatedResource(resource).subscribe(
      (response) => {
        const oldRecord = this.source.pagination.data.find(
          (x) => x.resourceFileId === resource.resourceFileId
        );
        this.source.updateRecord(oldRecord, response.newResource);
        actions.refreshChanged.emit(false);
      },
      () => {
        actions.refreshChanged.emit(false);
      }
    );
  }

  onViewDetails(resource: any) {
    this.router.navigateByUrl(
      'pages/jobs-management/job-files/' + resource.jobId
    );
  }

  onGenerateFile(resource: any, actions: JobFilesListActionsComponent) {
    this.resourceService
      .createRequest({
        jobId: resource.jobId,
        resourceFileId: resource.resourceFileId,
      })
      .subscribe(
        () => {
          this.messageService.showInfoMessage('Please wait until the Job File is generated');
          this.source.refresh();
        },
        () => {
          actions.enableGenerateFile();
          this.source.refresh();
        }
      );
  }

  onDownload(resource: any, actions: JobFilesListActionsComponent) {
    this.resourceService
      .validateDownloadResource(resource.resourceFileId)
      .subscribe(
        () => {
          this.resourceService.downloadResourceFile(
            resource.resourceFileId,
            {
              startCallback: () => actions.disableDownloadFile(),
              errorCallback: (errorArg) => {
                actions.enableDownloadFile();
                this.messageService.showError(errorArg.error);
              },
              successCallBack: () => {
                this.messageService.showSuccessMessage(
                  'File has been downloaded successfully'
                );
                actions.enableDownloadFile();
                this.source.refresh();
              },
              finallyCallback: () => {
                actions.enableDownloadFile();
              },
            },
            true
          );
        },
        () => {
          this.source.refresh();
        }
      );
  }
  async ngOnInit() {

    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });

    this.canGenerateFile = this.permissionService.hasPermission(PERMISSIONS.GenerateResourceFile);
    this.canManageFiles = this.permissionService.hasPermission(PERMISSIONS.ManageJobFiles);
    this.resourceTypes = await this.resourceService.getResourceTypes().toPromise();
    this.statuses = await this.resourceService.getStatuses().toPromise();
    this.recordsNumber = 5;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe((w) => this._onScreenSizeChanged(w));

    this.backgroundCall = setInterval(() => {
      if (this.source && !this.isLoading) {
        const pagination = this.source.pagination;

        if (pagination && pagination.data) {
          pagination.data
            .filter(o => o.status && o.status.value === 'Pending')
            .forEach(o => this.onRefreshResourceV2(o));
        }
      }
    }, 10000);

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

  displayStatusText(action: any) {
    return (TaskStatus[action] || '').replace(/([A-Z])/g, ' $1').trim();
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
    this.account = null;
    this.jobName = null;
    this.jobNumber = null;
    this.resourceType = '';
    this.status = '';
    this.message = null;
    this.fileDescription = null;
    this.hasUploadedFile = null;
    this.installedBy = null;
    this.maintainedBy = null;
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

  onHasUploadedFileChecked(event) {
    if (this.isLoading) {
      return;
    }
    this.hasUploadedFile = event;
    this.source.setPage(1, false);
    this.onSearch();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourResources') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['resourceFirstStep'],
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText,
        },
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourResources', '1');
    this.runGuidingTour = false;
  }

  ngOnDestroy(): void {
    this.modalService.hide();
    if (this.modelRef !== null && this.modelRef !== undefined) {
      this.modelRef.hide();
    }

    if (this.backgroundCall) {
      clearInterval(this.backgroundCall);
    }

    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    this.resourceService.dispose();
    this.stopGuidingTour();
    this.joyrideService = null;
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }

  goToJobs() {
    this.router.navigateByUrl('/pages/jobs-management/jobs');
  }
  goToShipments() {
    this.router.navigateByUrl('/pages/jobs-management/shipments');
  }
  goToJobsFile() {
    this.router.navigateByUrl('/pages/jobs-management/job-files');
  }
}

