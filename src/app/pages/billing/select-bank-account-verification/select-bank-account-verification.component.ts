import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-select-bank-account-verification',
  templateUrl: './select-bank-account-verification.component.html',
  styleUrls: ['./select-bank-account-verification.component.scss']
})
export class SelectBankAccountVerificationComponent implements OnInit {

  connect = new EventEmitter<void>();
  loading = new EventEmitter<any>();
  isLoading = false;

  constructor(
    private router: Router,
    private ref: BsModalRef,
  ) { }

  ngOnInit(): void {
    this.loading.subscribe(isloading => {
      this.isLoading = isloading;
    });
  }

  onCancel() {
    this.ref.hide();
  }

  onManual() {
    this.router.navigateByUrl('pages/billing/bank-accounts/add');
  }

  onConnect() {
    this.connect.next();
  }
}
