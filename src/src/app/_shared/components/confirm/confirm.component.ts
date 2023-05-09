import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  message: string;
  ok = new Subject<Object>();
  cancel = new Subject<Object>();

  confirmResult: boolean;
  constructor(
    private _modalRef: BsModalRef
    // protected dialogRef: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.confirmResult = false;
    this._modalRef.hide();
    // this.dialogRef.close(null);
    // this.cancel.next(null);
  }

  onOk() {
    this.confirmResult = true;
    this._modalRef.hide();
    // this.ok.next(null);
  }
}
