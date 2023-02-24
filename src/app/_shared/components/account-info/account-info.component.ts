import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  accountinfo: any;
  
  constructor(
    private modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  onOk() {
    this.modalRef.hide();
  }
}
