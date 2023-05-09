import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomerDetails } from '../../../../_shared/models/customer-details';
import { CustomerService } from '../../../../services/customer.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AddressFieldComponent } from '../../../../_shared/components/address-field/address-field.component';
import { IAddress } from '../../../../_shared/models/address.model';
import { CustomerAdminUsersComponent } from './customer-admin-users/customer-admin-users.component';

@Component({
  selector: 'ngx-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})

export class CustomerDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('users') users: CustomerAdminUsersComponent;
  showCloseButton = false;
  isLoading = true;
  customer: ICustomerDetails;
  @ViewChild('address') address: AddressFieldComponent;
  Address: IAddress;
  runGuidingTour = true;
  selectedTab: string;
  usersActiveTab = false;
  infoActiveTab = true;
  renderUsers: boolean;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService) {
    this.bcService.set('@customerName', { skip: true });
    this.selectedTab = history?.state?.tab;
  }

  ngOnInit(): void {
    const customerId = +this.route.snapshot.paramMap.get('id');

    if (!isFinite(customerId)) {
      this.router.navigateByUrl('pages/customers-management/customers');
      return;
    }

    this._setActiveTab();

    this.customerService.getCustomer(customerId).subscribe(resp => {
      this.customer = resp;
      this.bcService.set('@customerName', this.customer.name);
      this.bcService.set('@customerName', { skip: false });
      this.isLoading = false;
      setTimeout(() => {
        this.showCloseButton = true;
        this.users?.onSearch();
      }, 0);
    }, error => {
      this.isLoading = false;
      this.router.navigateByUrl('pages/customers-management/customers');
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.address);
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

  onNavigateToCustomers() {
    this.router.navigateByUrl('pages/customers');
  }

  onChangeTab($event) {
    const tabTitle = $event.tabTitle;

    if (tabTitle === 'Users') {
      this.renderUsers = true;
      this.users?.onSearch();
    }
  }

  ngOnDestroy(): void {
    // this.stopGuidingTour();
    // this.joyrideService = null;
  }

  // stopGuidingTour() {
  //   if (this.joyrideService && this.joyrideService.isTourInProgress()) {
  //     this.joyrideService.closeTour();
  //   }
  // }

  // startGuidingTour() {
  //   if (localStorage.getItem('GuidingTourCustomerAdminAccounts') === null) {
  //     this.runGuidingTour = true;
  //     this.openGuidingTour();
  //   } else {
  //     this.runGuidingTour = false;
  //   }
  // }

  // openGuidingTour() {
  //   if (this.joyrideService) {
  //     this.joyrideService.startTour(
  //       {
  //         steps: ['customerAdminAccountsFirstStep',],
  //         themeColor: guidingTourGlobal.guidingTourThemeColor,
  //         customTexts: {
  //           prev: guidingTourGlobal.guidingTourPrevButtonText,
  //           next: guidingTourGlobal.guidingTourNextButtonText,
  //           done: guidingTourGlobal.guidingTourDoneButtonText
  //         }
  //       }
  //     );
  //   }
  // }

  // onFinishingTour() {
  //   localStorage.setItem('GuidingTourCustomerAdminAccounts', '1');
  //   this.runGuidingTour = true;
  // }

  private _setActiveTab() {
    if (this.selectedTab === 'users') {
      this.usersActiveTab = true;
      this.infoActiveTab = false;
    } else if (this.selectedTab === 'info') {
      this.usersActiveTab = false;
      this.infoActiveTab = true;
    }
  }

  onClose() {
    this.router.navigateByUrl('pages/customers-management/customers');
  }
}
