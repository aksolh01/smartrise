import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IOpenQuoteContact } from '../../../../_shared/models/quote.model';

@Component({
  selector: 'ngx-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

  contact: IOpenQuoteContact;

  constructor(
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this._modalRef.hide();
  }
}
