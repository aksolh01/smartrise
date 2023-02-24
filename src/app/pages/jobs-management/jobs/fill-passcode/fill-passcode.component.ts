import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { JobService } from '../../../../services/job.service';
import { MessageService } from '../../../../services/message.service';
import { SmartriseValidators } from '../../../../_shared/constants';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-fill-passcode',
  templateUrl: './fill-passcode.component.html',
  styleUrls: ['./fill-passcode.component.scss']
})
export class FillPasscodeComponent implements OnInit {

  fillPasscodeForm: UntypedFormGroup;
  jobId: number;
  isUpdating = false;
  tempPasscode: string = null;
  formSubmitted = false;

  constructor(
    private modalRef: BsModalRef<FillPasscodeComponent>,
    private jobService: JobService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fillPasscodeForm = new UntypedFormGroup({
      tempPasscode: new UntypedFormControl(this.tempPasscode, [trimValidator, SmartriseValidators.whitespace])
    });
    this.fillPasscodeForm.markAllAsTouched();
  }

  onClose() {
    this.modalRef.hide();
  }

  onSubmit() {

    this.formSubmitted = true;
    if(this.fillPasscodeForm.invalid) {
      return;
    }

    if(this.isUpdating) {
      return;
    }

    this.tempPasscode = this.fillPasscodeForm?.value?.tempPasscode?.trim();
    this.isUpdating = true;
    this.jobService.fillPasscode({
      tempPasscode: this.tempPasscode,
      jobId: this.jobId
    }).subscribe(() => {
      this.isUpdating = false;
      this.messageService.showSuccessMessage('Passcode has been saved successfully');
      this.modalRef.hide();
    }, error => {
      this.isUpdating = false;
    });
  }
}
