import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { SmartriseValidators } from '../../../_shared/constants';

@Component({
  selector: 'ngx-dashboard-passcodes',
  templateUrl: './dashboard-passcodes.component.html',
  styleUrls: ['./dashboard-passcodes.component.scss']
})
export class DashboardPasscodesComponent implements OnInit {

  isLoading = false;
  form: UntypedFormGroup;
  formSubmitted: boolean;

  constructor(
    private router: Router,
    private jobService: JobService,
    private messageService: MessageService,
    private miscellaneousService: MiscellaneousService
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = new UntypedFormGroup({
      searchText: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim]),
    });

    this.form.markAllAsTouched();
  }

  onSubmit() {
    
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const searchText = encodeURIComponent(this.form.get('searchText').value);

    if (this.miscellaneousService.isCustomerUser()) {
      this.jobService.findJobByCustomerUser(searchText)
        .subscribe(
          (jobid) => {
            this._goToJobDetailPage(jobid);
          },
          (error) => {
            this.isLoading = false;
          }
        );
    } else {
      this.jobService.findJobBySmartriseUser(searchText)
        .subscribe(
          (jobId) => {
            this._goToJobDetailPage(jobId);
          },
          (error) => {
            this.isLoading = false;
          }
        );
    }
  }

  private _goToJobDetailPage(jobId) {
    this.router.navigateByUrl(`pages/jobs-management/jobs/${jobId}`);
  }
}
