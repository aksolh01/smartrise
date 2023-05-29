import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { FunctionConstants } from '../../../../_shared/constants';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PasscodeService } from '../../../../services/passcode.service';
import { MessageService } from '../../../../services/message.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { JoyrideService } from 'ngx-joyride';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { ResponsiveService } from '../../../../services/responsive.service';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { Tab } from '../../../../_shared/models/jobTabs';

@Component({
  selector: 'ngx-upload-config-file',
  templateUrl: './upload-config-file.component.html',
  styleUrls: ['./upload-config-file.component.scss']
})
export class UploadConfigFileComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('fileDescriptionArea') fileDescriptionArea: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  fileGeneratedOnce: boolean = false;
  fileUpload: FormGroup;
  fileDescriptionMaxLength: number = 20;
  selectedFilename: string;
  file: File;
  hideFileDescription: boolean = false;
  passcode: any;
  source: LocalDataSource;
  settings:any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      jobNumber: {
        title: 'Job Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Number');
        },
        show: false,
        filter: false
      },
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Job Name');
          instance.setOptions({
            breakWord: true,
            link: 'pages/jobs-management/jobs',
            paramExps: [
              'jobId'
            ],
            tooltip: 'View Job Details'
          });
        },
        show: false,
        filter: false
      },
      carName: {
        title: 'Car',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Car');
        },
        show: false,
        filter: false
      },
      code: {
        title: 'Passcode',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Passcode');
        },
        show: false,
        filter: false
      }
    }
  }

  private _isUploading: boolean;
  runGuidingTour: boolean = false;
  isSmall: any;
  responsiveSubscription: Subscription;

  @Input()
  set isUploading(c: boolean) {
    this._isUploading = c;
  }

  get isUploading(): boolean {
    return this._isUploading;
  }

  uploader: FileUploader = new FileUploader({
    url: '',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['*.h']
  });

  message: string = 'File Description is required';
  showRequiredMessage: boolean = false;
  showWhitespaceMessage: boolean = false;

  constructor(
    private passcodeService: PasscodeService,
    private messageService: MessageService,
    private joyrideService: JoyrideService,
    private responsiveService: ResponsiveService
  ) {

  }

  ngOnDestroy(): void {
    this.stopGuidingTour();
    this.joyrideService = null;
  }

  ngOnInit(): void {
    this.createUploadFileForm();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
    if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
      if (this.isSmall !== false) {
        this.isSmall = false;
      }
    } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
      if (this.isSmall !== true) {
        this.isSmall = true;
      }
    }
  }

  keyPress(event: any) {
    FunctionConstants.applyMask(event, '99/99/9999');
  }

  createUploadFileForm() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['uploader']) {
      this.fileInput.nativeElement.removeEventListener('change', this.onFileSelected.bind(this));
      this.fileInput.nativeElement.addEventListener('change', this.onFileSelected.bind(this));
    }
  }

  onFileSelected(event: File[]) {
    this.file = event[0];
    this.selectedFilename = this.file.name;

    this.onGenerate();
  }

  private _resetUpload() {
    this.selectedFilename = null;
    this.isUploading = false;
    this.fileInput.nativeElement.value = '';
  }

  onBlur(event) {
    let value = event.target.value;
    if (/^[^\s]+\s+/.test(value) || /^\s+[^\s]+/.test(value)) {
      this.showWhitespaceMessage = true;
    } else {
      this.showWhitespaceMessage = false;
    }

    if (value) {
      value = value.toString().trim();
    }
    if (!value && this.selectedFilename) {
      this.showRequiredMessage = true;
    }
  }

  onGenerate() {

    this.isUploading = true;

    this.passcodeService.uploadConfigFile(this.file)
      .subscribe(
        event => this._onProgress(event),
        error => this.isUploading = false
      );
  }

  private _onProgress(event: HttpEvent<Object>): void {

    switch (event.type) {
      case HttpEventType.Sent:
        this.isUploading = true;
        break;
      case HttpEventType.ResponseHeader:
        this.isUploading = false;
        break;
      case HttpEventType.UploadProgress:
        break;
      case HttpEventType.Response:
        this.messageService.showSuccessMessage(
          'Passcode(s) have been generated successfully'
        );
        this.fileGeneratedOnce = true;
        this._resetUpload();
        this.passcode = event.body;
        this._refreshTable();
        break;
    }
  }

  private _refreshTable() {
    this.source = new LocalDataSource(this.passcode.passcodes);
    this.source.refresh();
  }

  open() {
    this.showRequiredMessage = false;
    this.fileInput.nativeElement.click();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourQuotes') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      const steps = [];
      steps.push('generatePasscodeFirstStep');
      this.joyrideService.startTour({
        steps: steps,
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
    localStorage.setItem('GuidingTourQuotes', '1');
    this.runGuidingTour = false;
  }
}
