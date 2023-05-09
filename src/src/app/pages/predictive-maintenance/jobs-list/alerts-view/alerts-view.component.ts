import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-alerts-view',
  templateUrl: './alerts-view.component.html',
  styleUrls: ['./alerts-view.component.scss']
})
export class AlertsViewComponent implements OnInit {

  constructor(private ref: BsModalRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.hide();
  }
}
