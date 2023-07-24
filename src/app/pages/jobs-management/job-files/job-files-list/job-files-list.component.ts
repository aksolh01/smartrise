import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import {
  IConsolidatedResource,
  TaskStatus,
} from '../../../../_shared/models/job';
import {
  ResourceByCustomerUserParams,
  ResourceParams,
} from '../../../../_shared/models/resourceParams';
import { JobTabService } from '../../../../services/job-tabs.service';
import { MessageService } from '../../../../services/message.service';
import { ResourceService } from '../../../../services/resource.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { BaseComponent } from '../../../base.component';
import { JobFilesListActionsComponent } from './job-files-list-actions/job-files-list-actions.component';
import { ResourceTaskStatusCellComponent } from '../../../../_shared/components/business/status.component';
import { Observable, Subscription } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { InformativeCellComponentComponent } from '../../../../_shared/components/informative-cell-component/informative-cell-component.component';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { Tab } from '../../../../_shared/models/jobTabs';
import { BaseComponentService } from '../../../../services/base-component.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import {
  CommonValues,
  PERMISSIONS,
  TaskStatusConstants,
  URLs,
} from '../../../../_shared/constants';
import { HttpEventType } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { PermissionService } from '../../../../services/permission.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { ListTitleService } from '../../../../services/list-title.service';
import { IBusinessSettings } from '../../../../_shared/models/settings';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../../environments/environment';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';

@Component({
  selector: 'ngx-job-files-list',
  templateUrl: './job-files-list.component.html',
  styleUrls: ['./job-files-list.component.scss'],
})
export class JobFilesListComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
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
    private jobTabServive: JobTabService,
    private messageService: MessageService,
    private jobTabService: JobTabService,
    private responsiveService: ResponsiveService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private modalService: BsModalService,
    private permissionService: PermissionService,
    private multiAccountService: MultiAccountsService,
    private listTitleService: ListTitleService
    // private timerService: TimerService
  ) {
    super(baseService);
    // this.res$ = timerService.refreshResource();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 500);
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
            this.jobTabService.setSelectedTab(Tab.JobDetails);
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
          // instance.onClickCallBack = (rowData) => {
          //   const dialogData: InfoDialogData = {
          //     title: `File Description`,
          //     content: [rowData['fileDescription']],
          //     dismissButtonLabel: 'Close',
          //     showDismissButton: true,
          //     showAsBulltes: false
          //   };
          //   this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
          //     initialState: dialogData
          //   });
          // };
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
        title: 'Actions',
        type: 'custom',
        renderComponent: JobFilesListActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  // constructor(
  //   baseService: BaseComponentService,
  //   private router: Router,
  //   private resourceService: ResourceService,
  //   private jobTabServive: JobTabService,
  //   private messageService: MessageService,
  //   private jobTabService: JobTabService,
  //   private settingService: SettingService,
  //   private responsiveService: ResponsiveService,
  //   private joyrideService: JoyrideService,
  //   private miscellaneousService: MiscellaneousService,
  //   private modalService: BsModalService,
  //   private permissionService: PermissionService,
  //   private multiAccountService: MultiAccountsService
  //   // private timerService: TimerService
  //   )  {
  //   super(baseService);
  //   // this.res$ = timerService.refreshResource();
  // }

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

    this.source.serviceCallBack = (params) => this._getJobFiles(params);
    this.source.dataLoading.subscribe((result) => {
      // setTimeout(() => {
      //   this.isLoading = result;
      // }, 0);
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

    if (this.isSmartriseUser)
      resourceParams.hasUploadedFile = this.hasUploadedFile;
    else
      resourceParams.hasUploadedFile = true;

    if (this.isSmall) {
      this._fillFilterParameters(resourceParams);
    }

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.resourceService.getConsolidateResourcesBySmartriseUser(resourceParams);
    } else {
      var searchPayload = resourceParams as ResourceByCustomerUserParams;
      searchPayload.customerId = this.multiAccountService.getSelectedAccount();

      return this.resourceService.getConsolidateResourcesByCustomerUser(resourceParams);
    }
  }

  private _fillFilterParameters(resourceParams: ResourceParams) {
    resourceParams.account = this.account;
    resourceParams.jobName = this.jobName;
    resourceParams.jobNumber = this.jobNumber;
    resourceParams.message = this.message;
    resourceParams.fileDescription = this.fileDescription;
    resourceParams.resourceType = this.isEmpty(this.resourceType) ? null : this.resourceType;
    resourceParams.status = this.isEmpty(this.status) ? null : this.status;
    resourceParams.installedBy = this.installedBy;
    resourceParams.maintainedBy = this.maintainedBy;
  }

  onActionsInit(actions: JobFilesListActionsComponent) {
    actions.download.subscribe((resource) => {
      this.onDownload(resource, actions);
    });
    actions.generateFile.subscribe((resource) => {
      this.onGenerateFile(resource, actions);
    });
    actions.viewDetails.subscribe((resource) => {
      this.onViewDetails(resource);
    });
    actions.refreshResource.subscribe((resource) => {
      actions.refreshChanged.emit(true);
      this.onRefreshResource(resource, actions);
    });
    actions.uploadFile.subscribe((data) => {
      this._onUploadingFile(data);
    });
    actions.removeUploadedFile.subscribe((data) => {
      this.onRemoveUploadedFile(data);
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
    this.jobTabServive.setSelectedTab(Tab.JobFiles);
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
    // const sub = this.resourceService.downloadStatus.subscribe((s) => {
    //   switch (s.status) {
    //     case ProgressStatusEnum.COMPLETE:
    //       this.messageService.showSuccessMessage(
    //         'File has been downloaded successfully'
    //       );
    //       actions.enableDownloadFile();
    //       sub.unsubscribe();
    //       this.source.refresh();
    //       break;
    //     case ProgressStatusEnum.ERROR:
    //       actions.enableDownloadFile();
    //       this.messageService.showError(s.error);
    //       sub.unsubscribe();
    //       break;
    //     case ProgressStatusEnum.IN_PROGRESS:
    //       break;
    //     case ProgressStatusEnum.START:
    //       actions.disableDownloadFile();
    //       break;
    //   }
    // });

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

    this.title = await this.listTitleService.buildTitle('Job Files');

    this.canGenerateFile = this.permissionService.hasPermission(PERMISSIONS.GenerateResourceFile);
    this.canManageFiles = this.permissionService.hasPermission(PERMISSIONS.ManageJobFiles);
    this.resourceTypes = await this.resourceService.getResourceTypes().toPromise();
    this.statuses = await this.resourceService.getStatuses().toPromise();
    this.recordsNumber = environment.recordsPerPage;
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

  private _onBusinessSettingsReady(rep: IBusinessSettings) {
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
