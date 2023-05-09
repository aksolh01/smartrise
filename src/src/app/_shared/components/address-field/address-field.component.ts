import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { IAddress } from '../../models/address.model';
import { AddressComponent } from '../address/address.component';

@Component({
  selector: 'ngx-address-field',
  templateUrl: './address-field.component.html',
  styleUrls: ['./address-field.component.scss']
})
export class AddressFieldComponent implements OnInit, OnDestroy {

  value = 'N/A';
  subscription: Subscription;
  modalRef: BsModalRef<AddressComponent>;

  @Input() Address: IAddress;
  @Input() FullAddress: string;

  getAddress: (key: any) => Observable<IAddress>;

  constructor(private modalService: BsModalService) { }

  ngOnDestroy(): void {
    this.modalService.hide();
  }

  ngOnInit(): void {

  }

  onShowAddressDetails() {
    this.modalRef = this.modalService.show<AddressComponent>(AddressComponent, {
      initialState: {
        Address: this.Address
      }
    });

    this.subscription = this.modalRef.onHidden
      .subscribe(() => {
        this.subscription.unsubscribe();
      });
  }
}
