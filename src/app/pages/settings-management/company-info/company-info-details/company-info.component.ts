import { Component, OnInit } from '@angular/core';
import { ICustomerDetails } from '../../../../_shared/models/customer-details';
import { CustomerService } from '../../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BaseComponent } from '../../../base.component';
import { URLs } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent extends BaseComponent implements OnInit {

  showCloseButton: boolean = false;
  clickableEmail: string = '';
  isLoading: boolean = false;
  companyinfo: ICustomerDetails;

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bcService: BreadcrumbService,
    baseService: BaseComponentService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.bcService.set('@companyName', { skip: true });

    const accountId = +this.activatedRoute.snapshot.paramMap.get('id');

    if (!isFinite(accountId)) {
      this.router.navigateByUrl(URLs.CompanyInfoURL,);
      return;
    }

    this.customerService.getCompayInfoByAccountId(accountId).subscribe(companyinfo => {
      this.showCloseButton = true;
      this.companyinfo = companyinfo;
      this.clickableEmail = 'mailto:' + companyinfo?.salesRepresentative?.email;
      
      this.bcService.set('@companyName', companyinfo.name);
      this.bcService.set('@companyName', { skip: false });

      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.router.navigateByUrl('pages/settings-management/accounts');
    });
  }

  onClose() {
    this.router.navigateByUrl(URLs.CompanyInfoURL);
  }

  getValue(value: any) {
    if (value === null)
      return 'N/A';
    if (value.toString().trim() === '')
      return 'N/A';
    return value;
  }
}
