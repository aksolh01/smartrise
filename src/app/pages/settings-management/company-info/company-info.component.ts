import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from '../../../services/message.service';
import { ICustomerDetails } from '../../../_shared/models/customer-details';

@Component({
  selector: 'ngx-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {

  showCloseButton = false;
  clickableEmail = '';
  isLoading = false;
  companyinfo: ICustomerDetails;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.customerService.getCompayInfo().subscribe(companyinfo => {
      this.showCloseButton = true;
      this.companyinfo = companyinfo;
      this.clickableEmail = 'mailto:' + companyinfo?.salesRepresentative?.email;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  getValue(value: any) {
    if (value === null) {
return 'N/A';
}
    if (value.toString().trim() === '') {
return 'N/A';
}
    return value;
  }
}
