import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InfoDialogData } from './info-dialog-data';

@Component({
  selector: 'ngx-smr-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent implements InfoDialogData {
  @Input() title: string;

  @Input() set content(data: string | string[] | { title: string; list: string[] }[]) {
    if (Array.isArray(data)) {
      if (typeof data[0] === "string") {
        this.dialogContent = (<string[]>data).filter(m => m && m.trim());
      } else {
        this.showAsGroupList = true;
        this.dialogGroupContent = <{ title: string; list: string[] }[]>data;
      }
    } else if (typeof data === "string") {
      this.dialogContent = [data];
    }
  }

  @Input() dismissButtonLabel: string;
  @Input() messageIfEmpty: string = '';
  @Input() showDismissButton: boolean = true;
  @Input() showAsBulltes: boolean = false;
  @Input() showAsGroupList: boolean = false;

  get showEmptyMessage(): boolean {
    return (!this.dialogContent ||
      !this.dialogContent.length ||
      !this.dialogContent.filter(m => m && m.trim()).length) &&
      (!this.dialogGroupContent || !this.dialogGroupContent.length);
  }

  dialogContent: string[];
  dialogGroupContent: { title: string; list: string[] }[];

  constructor(private _modalRef: BsModalRef<InfoDialogComponent>) {
  }

  dismiss(): void {
    this._modalRef.hide();
  }
}
