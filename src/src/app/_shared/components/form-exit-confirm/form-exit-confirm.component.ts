import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormExitValue } from '../../models/dialog.model';

@Component({
  selector: 'ngx-form-exit-confirm',
  templateUrl: './form-exit-confirm.component.html',
  styleUrls: ['./form-exit-confirm.component.scss']
})
export class FormExitConfirmComponent implements OnInit {

  message: string;
  title: string;

  disableExit = false;
  disableNo = false;
  disableCancel = false;

  result?: FormExitValue;
  save = new Subject<void>();
  exit = new Subject<void>();
  cancel = new Subject<void>();

  confirmResult: boolean;
  constructor(
    private _modalRef: BsModalRef
  ) { }


  ngOnInit(): void {
  }

  onExit() {
    this.exit.next();
    this.result = FormExitValue.Exit;
    this._modalRef.hide();
  }

  onCancel() {
    this.cancel.next();
    this.result = FormExitValue.Cancel;
    this._modalRef.hide();
  }
}
