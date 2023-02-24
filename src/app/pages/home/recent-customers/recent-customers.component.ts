import { Component, Input, OnInit } from '@angular/core';
import { IRecentCustomer } from '../../../_shared/models/customer-lookup';

@Component({
  selector: 'ngx-recent-customers',
  templateUrl: './recent-customers.component.html',
  styleUrls: ['./recent-customers.component.scss']
})
export class RecentCustomersComponent implements OnInit {

  @Input() isLoading = true;
  @Input() data: IRecentCustomer[] = null;

  constructor() { }

  ngOnInit(): void {
  }
}
