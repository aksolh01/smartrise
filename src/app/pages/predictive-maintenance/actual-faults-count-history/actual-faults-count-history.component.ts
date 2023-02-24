import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IFaultData } from '../../../_shared/models/faultData';

@Component({
  selector: 'ngx-actual-faults-count-history',
  templateUrl: './actual-faults-count-history.component.html',
  styleUrls: ['./actual-faults-count-history.component.scss']
})
export class ActualFaultsCountHistoryComponent implements OnInit {

  faults: IFaultData[];

  constructor(private _modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this._modalRef.hide();
  }
}
