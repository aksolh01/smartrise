import { Component, Input, OnInit } from '@angular/core';
import { ICustomerRecord } from '../../../_shared/models/customer-lookup';

@Component({
  selector: 'ngx-favorite-customer',
  templateUrl: './favorite-customer.component.html',
  styleUrls: ['./favorite-customer.component.scss']
})
export class FavoriteCustomerComponent implements OnInit {

  @Input() isLoading = true;
  @Input() data: ICustomerRecord[] = null;

  constructor() { }

  ngOnInit(): void {  }

}
