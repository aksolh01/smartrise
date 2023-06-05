import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { SmartriseValidators } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-clone-dialog',
  templateUrl: './clone-dialog.component.html',
  styleUrls: ['./clone-dialog.component.scss']
})
export class CloneDialogComponent implements OnInit {
  formSubmitted: boolean = false;
  form: FormGroup;
  message: string;
  ok = new Subject<Object>();
  cancel = new Subject<Object>();
  get jobName(): string {
    return this.form?.value?.jobName;
  }
  confirmed: boolean;
  constructor(
    private _modalRef: BsModalRef
    // protected dialogRef: NbDialogRef<any>
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = new FormGroup({
      'jobName': new FormControl(null, [SmartriseValidators.requiredWithTrim,
      SmartriseValidators.trimError])
    });
  }

  onCancel() {
    this.confirmed = false;
    this._modalRef.hide();
  }

  onClone() {

    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.confirmed = true;
    this._modalRef.hide();
  }
}
