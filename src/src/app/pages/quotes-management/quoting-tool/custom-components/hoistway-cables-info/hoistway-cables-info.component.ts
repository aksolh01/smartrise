import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-hoistway-cables-info',
  templateUrl: './hoistway-cables-info.component.html',
  styleUrls: ['./hoistway-cables-info.component.scss']
})
export class HoistwayCablesInfoComponent implements OnInit {
  constructor(
    private _modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this._modalRef.hide();
  }
}
