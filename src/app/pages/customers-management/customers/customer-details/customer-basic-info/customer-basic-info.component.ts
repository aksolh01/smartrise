import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICustomerDetails } from '../../../../../_shared/models/customer-details';

@Component({
  selector: 'ngx-customer-basic-info',
  templateUrl: './customer-basic-info.component.html',
  styleUrls: ['./customer-basic-info.component.scss']
})
export class CustomerBasicInfoComponent implements OnInit {

  @Input() customer: ICustomerDetails;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClose() {
    this.router.navigateByUrl('pages/customers-management/customers');
  }
}
