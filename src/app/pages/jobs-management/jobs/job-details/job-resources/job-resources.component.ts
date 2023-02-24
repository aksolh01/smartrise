import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { JoyrideService } from 'ngx-joyride';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { PERMISSIONS, TaskStatusConstants } from '../../../../../_shared/constants';
import { IJobResource } from '../../../../../_shared/models/job';
import { MessageService } from '../../../../../services/message.service';
import { ResourceService } from '../../../../../services/resource.service';
import { BaseComponent } from '../../../../base.component';
import { JobResourcesActionsComponent } from './job-resources-actions/job-resources-actions.component';
import * as guidingTourGlobal from '../../../../guiding.tour.global';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { PermissionService } from '../../../../../services/permission.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-job-resources',
  templateUrl: './job-resources.component.html',
  styleUrls: ['./job-resources.component.scss'],
})
export class JobResourcesComponent extends BaseComponent implements OnInit, OnDestroy {

  backgroundCall: NodeJS.Timeout;
  showFilters = false;
  isLoading = false;
  isSmall: boolean | null;
  isRefreshing = false;
  @Input() jobId: number;
  @Input() runGuidingTour: boolean;
  @Input() resourceFiles: IJobResource[] = [];
  source = new LocalDataSource();
  canGenerateFiles: boolean;

  constructor(
    private router: Router,
    private resourceService: ResourceService,
    private messageService: MessageService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  settings = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 20,
    },
    columns: {
      resourceType: {
        title: 'File Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('File Type');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: false,
        sort: false,
        width: '90%',
      },
      // customerMessage: {
      //   title: 'Message',
      //   type: 'custom',
      //   renderComponent: Ng2TableCellComponent,
      //   onComponentInitFunction: (instance: Ng2TableCellComponent) => {
      //     instance.setHeader('Message');
      //   },
      //   filter: false,
      //   sort: false,
      //   width: '60%',
      // },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: JobResourcesActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  ngOnInit(): void {
    this.canGenerateFiles = this.permissionService.hasPermission(PERMISSIONS.GenerateResourceFile);

    this.source = new LocalDataSource(this.resourceFiles);
    this.startGuidingTour();

    this.backgroundCall = setInterval(() => {
      if (this.source) {
        if (this.resourceFiles) {
          this.resourceFiles
            .filter((o) => o.status === TaskStatusConstants.Pending)
            .forEach((o) => this.onRefreshResourceV2(o));
        }
      }
    }, 10000);
  }

  onDownloadFile(
    resource: IJobResource,
    actions: JobResourcesActionsComponent
  ) {

    actions.disableDownloadFile();
    const validateDownloadSub = this.resourceService
      .validateDownloadResource(resource.id)
      .subscribe(
        (response) => {
          this.resourceService.downloadResourceFile(
            resource.id,
            {
              finallyCallback: () => {
                actions.enableDownloadFile();
                this.onRefresh();
              },
              errorCallback: (e) => {
                actions.enableDownloadFile();
                this.messageService.showError(e.error);
              },
              successCallBack: (e) => {
                this.messageService.showSuccessMessage(
                  'File has been downloaded successfully'
                );
                actions.enableDownloadFile();
                this.onRefresh();
                // this.resourceService.refreshResource(resource).subscribe((obj) => {
                //   this.updateRecord(resource, obj.response);
                //   actions.refreshChanged.emit(false);
                //   actions.enableGenerateFile();
                // });
              },
            },
            true);
          validateDownloadSub.unsubscribe();
        },
        (error) => {
          this.onRefresh();
          // this.resourceService.refreshResource(resource).subscribe((obj) => {
          //   this.updateRecord(resource, obj.response);
          //   actions.refreshChanged.emit(false);
          //   actions.enableGenerateFile();
          // });
          validateDownloadSub.unsubscribe();
        }
      );
  }

  onRefresh() {
    this.isRefreshing = true;

    this.resourceService.getResources(this.jobId).subscribe((response) => {
      this.isRefreshing = false;
      this.resourceFiles = response;
      this.source = new LocalDataSource(this.resourceFiles);
    });
  }

  onActionsInit(actions: JobResourcesActionsComponent) {
    actions.createNewRequest.subscribe((row: IJobResource) => {
      actions.disableGenerateFile();
      this.resourceService
        .createRequest({
          jobId: this.jobId,
          resourceFileId: row.id,
        })
        .subscribe(
          (resp) => {
            this.messageService.showInfoMessage(
              'Please wait until the Job File is generated'
            );
            this.resourceService.refreshResource(row).subscribe((obj) => {
              this.updateRecord(row, obj.response);
              actions.refreshChanged.emit(false);
              actions.enableGenerateFile();
            });
          },
          (error) => {
            this.resourceService.refreshResource(row).subscribe((obj) => {
              this.updateRecord(row, obj.response);
              actions.refreshChanged.emit(false);
              actions.enableGenerateFile();
            });
          }
        );
    });
    actions.downloadFile.subscribe((row: IJobResource) => {
      this.onDownloadFile(row, actions);
    });
    actions.refreshResource.subscribe((row: IJobResource) => {
      this.resourceService.refreshResource(row).subscribe((obj) => {
        this.updateRecord(row, obj.response);
        actions.refreshChanged.emit(false);
      });
    });
  }

  onRefreshResourceV2(row: any) {
    if (row) {
      this.resourceService.refreshResource(row).subscribe((obj) => {
        if (obj.response.status === TaskStatusConstants.Failed) {
          this.messageService.showErrorMessage(`Fail to generate '${obj.response.resourceType.description}' Job File`);
        } else if (obj.response.status === TaskStatusConstants.Completed) {
          this.messageService.showSuccessMessage(`'${obj.response.resourceType.description}' Job File has been generated successfully`);
        }
        this.updateRecord(row, obj.response);
      });
    }
  }

  updateRecord(row: IJobResource, newRow: IJobResource) {
    const index = this.resourceFiles.indexOf(row);
    if (newRow != null) {
      this.resourceFiles[index] = newRow;
    } else {
      this.resourceFiles.splice(index, 1);
    }
    this.source.refresh();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy() {
    if (this.backgroundCall) {
      clearInterval(this.backgroundCall);
    }

    this.resourceService.dispose();
    this.stopGuidingTour();
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourJobResources') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour(
        {
          steps: ['jobResourceFirstStep', ],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        }
      );
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourJobResources', '1');
    this.runGuidingTour = true;
  }

  onClose() {
    this.router.navigateByUrl('pages/jobs-management/jobs');
  }
}
