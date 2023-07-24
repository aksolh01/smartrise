import { Component, Input, OnInit } from '@angular/core';
import { JobService } from '../../../services/job.service';
import { MessageService } from '../../../services/message.service';
import { Router } from '@angular/router';
import { URLs } from '../../../_shared/constants';

@Component({
  selector: 'ngx-active-jobs',
  templateUrl: './active-jobs.component.html',
  styleUrls: ['./active-jobs.component.scss']
})
export class ActiveJobsComponent implements OnInit {

  private _activeJobIDs: number[];
  index: number = 0;
  isLoading: boolean = true;

  @Input()
  public set activeJobIDs(value: number[]) {
    this._activeJobIDs = value;
    if (value?.length > 0)
      this._retrieveActiveJob();
  }
  public get activeJobIDs(): number[] {
    return this._activeJobIDs;
  }

  @Input() activeJob: any;

  constructor(
    private jobService: JobService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onPrev() {
    this.index--;
    if (this.index > -1) {
      this._retrieveActiveJob();
    }
  }

  onNext() {
    this.index++;
    if (this.index < this.activeJobIDs.length) {
      this._retrieveActiveJob();
    }
  }

  onGoToJobDetails(jobId: number) {
    this.router.navigateByUrl(`${URLs.JobsURL}/${jobId}`);
  }

  private _retrieveActiveJob() {
    this.isLoading = true;
    this.jobService.getActiveJob(this.activeJobIDs[this.index])
      .subscribe(result => {
        this.activeJob = result;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }

  onDownloadJobFile(jobFile) {

  }
}
