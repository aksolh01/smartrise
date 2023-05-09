import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAddress } from '../../models/address.model';

@Component({
  selector: 'ngx-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  Address: IAddress;
  value: 'N/A';

  constructor(
    private _modalRef: BsModalRef,
    ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this._modalRef.hide();
  }
}
