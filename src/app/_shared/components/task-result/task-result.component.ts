import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskSyncronizerService } from '../../../services/task-syncronizer.service';

@Component({
  selector: 'ngx-task-result',
  templateUrl: './task-result.component.html',
  styleUrls: ['./task-result.component.scss']
})
export class TaskResultComponent implements OnInit {

  statuses: any[];
  title: string;
  showClose = false;

  constructor(
    private taskSyncronizer: TaskSyncronizerService,
    private _modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.taskSyncronizer.terminate();
    this._modalRef.hide();
  }

  getStatusColor(status) {
    if (status.status === 'Done') {
      return 'green';
    }
    if (status.status === 'Failed') {
      return 'red';
    }
    if (status.status === 'InProgress') {
      return 'transparent';
    }
  }
}
