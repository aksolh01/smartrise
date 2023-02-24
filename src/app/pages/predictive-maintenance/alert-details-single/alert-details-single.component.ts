import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAlertDetails } from '../../../_shared/models/alertData';

@Component({
  selector: 'ngx-alert-details-single',
  templateUrl: './alert-details-single.component.html',
  styleUrls: ['./alert-details-single.component.scss']
})
export class AlertDetailsSingleComponent implements OnInit {

  alert: IAlertDetails;

  constructor(private ref: BsModalRef) { }

  ngOnInit(): void {
  }

  onClose() {
    this.ref.hide();
  }
}
