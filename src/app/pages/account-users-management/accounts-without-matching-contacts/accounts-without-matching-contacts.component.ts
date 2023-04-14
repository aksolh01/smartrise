import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-accounts-without-matching-contacts',
  templateUrl: './accounts-without-matching-contacts.component.html',
  styleUrls: ['./accounts-without-matching-contacts.component.scss']
})
export class AccountsWithoutMatchingContactsComponent implements OnInit {

  messageStatus: 'success' | 'failed';
  accounts: any[];
  topMessage: string;
  bottomMessage: string;
  message: string;

  constructor(private modalRef: BsModalRef) { }

  ngOnInit(): void {

  }

  onOk() {
    this.modalRef.hide();
  }
}
