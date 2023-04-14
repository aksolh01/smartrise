import { Component, Input } from '@angular/core';
import { TaskStatusConstants } from '../../constants';
import { TaskStatus } from '../../models/job';

@Component({
  template: `<div class="container">
    <div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge badge-success text-white" *ngIf="status === completed">Completed</div>
    <div class="badge badge-danger text-white" *ngIf="status === failed">Failed</div>
    <div class="badge badge-warning text-white" *ngIf="status === inProgress">In Progress</div>
    <div class="badge badge-info text-white" *ngIf="status === pending">Pending</div>
    <ng-template [ngIf]="!!status" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="status === null">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
    </div>
    `
})
export class ResourceTaskStatusCellComponent {
  pending = TaskStatusConstants.Pending;
  inProgress = TaskStatusConstants.InProgress;
  failed = TaskStatusConstants.Failed;
  completed = TaskStatusConstants.Completed;

  status: string;
  @Input() set value(val: any) {
    this.status = val;
  }

  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  displayText(data: any) {
      return TaskStatus[data];
  }
}
