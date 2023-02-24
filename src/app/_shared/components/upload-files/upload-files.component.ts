import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { FunctionConstants } from '../../constants';
import { guid } from '../../functions';
import { ScreenBreakpoint } from '../../models/screenBreakpoint';

@Component({
  selector: 'ngx-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  files: any[] = [];
  public get newFiles(): any[] {
    return this.files.filter(f => f.id === 0);
  }
  removedFiles: number[] = [];
  @Output() removingAttachment = new EventEmitter<any>();
  @Output() attachmentRemoved = new EventEmitter<any>();
  @Output() attachmentAdded = new EventEmitter<any>();
  @ViewChild('fileDropRef') fileDropRef: ElementRef;
  modalRef: any;
  cols: number = 4;

  constructor(
    private modelService: BsModalService,
    private miscellaneousService: MiscellaneousService,
    private responsiveService: ResponsiveService
  ) { }

  hasNewFiles(): boolean {
    return this.files.filter(f => f.id === 0).length > 0;
  }

  hasRemovedFiles(): boolean {
    return this.removedFiles.length > 0;
  }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.cols = 4;
      }
      if (w === ScreenBreakpoint.md) {
        this.cols = 3;
      }
      if (w === ScreenBreakpoint.sm) {
        this.cols = 2;
      }
      if (w === ScreenBreakpoint.xs) {
        this.cols = 1;
      }
    });
  }

  hasLeftPadding(i) {
    return (i % this.cols) < this.cols;
  }

  hasRightPadding(i) {
    return i % this.cols === this.cols - 1;
  }

  loadAttachments(attachments) {
    this.files = attachments.map(x => ({
        id: x.id,
        data: {
          name: x.originalFileName,
          size: x.size,
        },
        ui: guid()
      }));
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
    this.fileDropRef.nativeElement.value = '';
  }

  /**
   * Delete file from files list
   *
   * @param index (File index)
   */
  tryDeleteFile(index: number) {
    this.removingAttachment.next(index);
  }

  deleteFile(index: number) {
    const r = this.files.splice(index, 1);
    if (r[0].id) this.removedFiles.push(r[0].id);
    this.attachmentRemoved.emit();
  }

  updateFileID(fileUI, id) {
    this.files.filter(x => x.ui === fileUI)[0].id = id;
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].data.progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].data.progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   *
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.attachmentAdded.emit();
    for (const item of files) {
      this.files.push({ id: 0, data: item, ui: guid() });
    }
  }

  /**
   * format bytes
   *
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    return FunctionConstants.FormatBytes(bytes, decimals);
  }

  clearRemovedFiles() {
    this.removedFiles.splice(0, this.removedFiles.length);
  }
}
