import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss']
})
export class SelectAccountComponent implements OnInit {

  private _selectClicked = false;
  selectedAccount: number | null;
  accounts: any[] = [];
  hideAllOption = false;

  constructor(
    private modalRef: BsModalRef,
  ) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.modalRef.hide();
  }

  onSelect() {
    this._selectClicked = true;
    this.modalRef.hide();
  }

  selectionChangeApplied(): boolean {
    return this._selectClicked;
  }
}
