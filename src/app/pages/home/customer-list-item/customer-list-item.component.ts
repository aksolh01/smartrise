import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IRecentCustomer } from '../../../_shared/models/customer-lookup';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'ngx-customer-list-item',
  templateUrl: './customer-list-item.component.html',
  styleUrls: ['./customer-list-item.component.scss']
})
export class CustomerListItemComponent implements OnInit {

  @Input() customer: IRecentCustomer;

  isSmall?: boolean = null;

  responsiveSubscription: Subscription;

  constructor(
    private router: Router,
    private readonly responsiveService: ResponsiveService) { }

  ngOnInit(): void {
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
  }

  goToCustomerDetail() {
    this.router
    .navigateByUrl(`pages/customers-management/customers/${this.customer.id}`);
  }
}
