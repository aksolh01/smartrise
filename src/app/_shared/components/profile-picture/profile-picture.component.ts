import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { AccountService } from '../../../services/account.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'ngx-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements OnInit, OnChanges, OnDestroy {
  @Input() allowRemovePhoto: boolean;
  @Input() profileLoading: boolean;
  @Input() url: any;
  @Input() photoGuid: string;

  uploadPictureText = 'Edit Photo';
  uploader: FileUploader;
  hasDragOver = false;
  baseUrl = environment.apiUrl;
  file: File;
  fileName = 'No file selected';
  uploading: boolean;
  refernceUrl = '/assets/profile-placeholder.png';
  changeProfileTooltip = 'Edit Photo';

  public previewPath: any;
  modalRef: any;
  canRenderImage: boolean;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private accountService: AccountService,
    private miscellaneousService: MiscellaneousService,
    private modalService: BsModalService) {

  }

  ngOnDestroy(): void {
    this.uploader?.cancelAll();
    this.modalService.hide();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'url': {
            if (this.url && this.url !== this.refernceUrl) {
              this.uploadPictureText = 'Edit Photo';
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.url = this.refernceUrl;
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'account/profile/upload',
      authToken: 'Bearer ' + this.tokenService.getToken(),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onWhenAddingFileFailed = () => {
      this.canRenderImage = false;
      this.messageService.showErrorMessage('Not a valid image');
    };

    this.uploader.onAfterAddingFile = (file) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }

      file.withCredentials = false;
      this.setPreview(file);
      this.uploading = true;
    };

    this.uploader.onSuccessItem = (fileItem, response) => {
      if (response) {
        const photo = JSON.parse(response);
        this.photoGuid = photo.photoGuid;
        this.uploading = false;
        this.uploadPictureText = 'Edit Photo';
        this.messageService.showSuccessMessage('Profile Picture has been uploaded successfully');
      }
    };
  }

  public setPreview(file: FileItem) {
    file.withCredentials = false;
    let fr = null;
    fr = new FileReader();
    fr.onload = () => {
      this.url = fr.result;
    };
    fr.readAsDataURL(file._file);
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;
      const reader = new FileReader();
      reader.onerror = (e) => {
        console.log(e);
      };

      reader.onload = () => {
        if (this.canRenderImage) {
          this.url = reader.result;
          this.allowRemovePhoto = true;
        }
      };

      reader.readAsDataURL(file);

    }
  }

  confirmDeleteProfilePhoto() {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to remove your profile picture?', () => {
        this._deleteProfilePhoto();
      });
  }

  private _deleteProfilePhoto() {
    if (this.photoGuid) {
      this.accountService.deleteProfilePhoto(this.photoGuid).subscribe(() => {
        this.photoGuid = null;
        this.url = this.refernceUrl;
        this.uploadPictureText = 'Edit Photo';
        this.allowRemovePhoto = false;
        this.messageService.showSuccessMessage('Profile Picture has been removed successfully');
      },
        () => {
        });
    }
  }

  onRemovePhoto() {
    this.confirmDeleteProfilePhoto();
  }
}
