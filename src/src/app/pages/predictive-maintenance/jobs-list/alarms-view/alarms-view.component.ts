import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-alarms-view',
  templateUrl: './alarms-view.component.html',
  styleUrls: ['./alarms-view.component.scss']
})
export class AlarmsViewComponent implements OnInit {

  constructor(private ref: BsModalRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.hide();
  }
}
