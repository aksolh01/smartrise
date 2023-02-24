import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { replaceAll } from '../../../../../_shared/functions';
import { IJob } from '../../../../../_shared/models/job';
import { FillPasscodeComponent } from '../../fill-passcode/fill-passcode.component';

@Component({
  selector: 'ngx-job-basiic-info',
  templateUrl: './job-basiic-info.component.html',
  styleUrls: ['./job-basiic-info.component.scss'],
})
export class JobBasiicInfoComponent implements OnDestroy , OnChanges {
  @Input() job: IJob;
  @Input() displayAccountName: boolean;
  @Output() refresh = new EventEmitter<void>();
  passcode: string;



  constructor(
    private router: Router,
    private modelService: BsModalService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.passcode = replaceAll(this.job?.tempPasscode, '\n', '</br>')?.trim();
  }

  ngOnDestroy(): void {
    this.modelService?.hide();
  }

  getValue(value: any) {
    return value === null || value.toString().trim() === '' ? 'N/A' : value;
  }

  onClose() {
    this.router.navigateByUrl('pages/jobs-management/jobs');
  }

  onFillPasscode() {
    const ref = this.modelService.show<FillPasscodeComponent>(FillPasscodeComponent,
      {
        initialState: {
          jobId: this.job.id,
        }
      }
    );
    ref.onHide.subscribe(() => {
      this.refresh.next();
    });
  }
}
