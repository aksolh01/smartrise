import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SmartriseValidators } from '../../../../_shared/constants';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  @ViewChild('fileDescriptionArea') fileDescriptionArea: ElementRef;
  fileUpload: UntypedFormGroup;
  @ViewChild('fileInput') fileInput: ElementRef<any>;
  fileDescriptionMaxLength = 20;
  fileDescription = '';
  notBrowsed = true;
  formSubmitted = false;
  selectedFilename: string;
  file: File;
  progress: number = 0;
  hideFileDescription: boolean = false;
  private _isUploading: boolean;

  @Input()
  set isUploading(c: boolean) {
    this._isUploading = c;
    if (c) {
      this.fileUpload.controls['fileDescription'].disable();
    } else {
      this.fileUpload.controls['fileDescription'].enable();
    }
  }

  get isUploading(): boolean {
    return this._isUploading;
  }

  upload = new EventEmitter<any>();
  uploader: FileUploader = new FileUploader({
    url: '',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf']
  });
  message = 'File Description is required';
  showRequiredMessage = false;
  showWhitespaceMessage = false;

  constructor(private modalRef: BsModalRef<FileUploaderComponent>) {
  }

  ngOnInit(): void {
    this.createUploadFileForm();
  }

  createUploadFileForm() {
    this.fileUpload = new UntypedFormGroup({
      fileDescription: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator]),
    });
    this.fileUpload.markAllAsTouched();
  }

  onFileSelected(event: File[]) {
    this.file = event[0];
    this.notBrowsed = false;
    this.selectedFilename = this.file.name;
  }

  resetUpload() {
    this.progress = 0;
    this.isUploading = false;
  }

  onBlur(event) {
    let value = event.target.value;
    if (/^[^\s]+\s+/.test(value) || /^\s+[^\s]+/.test(value)) {
      this.showWhitespaceMessage = true;
    } else {
      this.showWhitespaceMessage = false;
    }
    // if (value.toString().length > 0 &&
    //   (
    //     value.toString().startsWith(' ') ||
    //     value.toString().endsWith(' ')
    //   )
    // ) {
    //   this.showWhitespaceMessage = true;
    //   return;
    // } else {
    //   this.showWhitespaceMessage = false;
    // }

    if (value) {
      value = value.toString().trim();
    }
    if (!value && this.selectedFilename) {
      this.showRequiredMessage = true;
    }
  }

  onUpload() {

    this.formSubmitted = true;

    if(this.notBrowsed || !this.fileUpload.valid) {
      return;
    }

    if (!!this.fileDescription.trim()) {
      this.isUploading = true;
      this.upload.emit({ file: this.file, fileDescription: this.fileDescription });
    } else {
      this.showRequiredMessage = true;
    }
  }

  onClose() {
    this.modalRef.hide();
  }

  open() {
    this.showRequiredMessage = false;
    this.fileInput.nativeElement.click();
  }

  fileDescriptionKeyUp() {
    let value = this.fileDescription;

    if (/^[^\s]+\s+/.test(value) || /^\s+[^\s]+/.test(value)) {
      this.showWhitespaceMessage = true;
    } else {
      this.showWhitespaceMessage = false;
    }

    if (value) {
      value = value.trim();
    }
    if (!value) {
this.showRequiredMessage = true;
} else {
this.showRequiredMessage = false;
}
  }
}
