import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IJob, IJobResource } from '../../../../../_shared/models/job';
import { MiscellaneousService } from '../../../../../services/miscellaneous.service';
import { ResourceService } from '../../../../../services/resource.service';
import { MessageService } from '../../../../../services/message.service';
import { PasscodeService } from '../../../../../services/passcode.service';

@Component({
  selector: 'ngx-job-basiic-info',
  templateUrl: './job-basiic-info.component.html',
  styleUrls: ['./job-basiic-info.component.scss'],
})
export class JobBasiicInfoComponent implements OnDestroy, OnChanges, OnInit {

  private _job: IJob;
  isRequesting: boolean = false;
  @Input() public set job(v: IJob) {
    this._job = v;
  }
  public get job(): IJob {
    return this._job;
  }

  @Input() displayAccountName: boolean;
  @Output() refresh = new EventEmitter();
  accountTitle: string;
  isSmartrise: boolean;
  backgroundResourceStatusChecking: NodeJS.Timeout;
  status: string;

  constructor(
    private router: Router,
    private modelService: BsModalService,
    private miscellaneousService: MiscellaneousService,
    private resourceService: ResourceService,
    private messageService: MessageService,
    private passcodeService: PasscodeService
  ) {

  }

  ngOnInit(): void {
    this.isSmartrise = this.miscellaneousService.isSmartriseUser();
    this._setAccountTitle();
  }

  private _setAccountTitle() {
    this.accountTitle = this.miscellaneousService.isSmartriseUser() ? 'Ordered By' : 'Account Name';
  }

  ngOnChanges(changes: SimpleChanges): void {
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
}
