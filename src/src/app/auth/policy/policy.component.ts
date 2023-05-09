import { Component, OnInit } from '@angular/core';
import { IAuthPageComponent } from '../auth-page.interface';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'ngx-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements IAuthPageComponent, OnInit {
  pageTitle = '';
  showPolicy = false;
  prevUrl: string;

  constructor(
    private routeringService: RoutingService,
    private accountService: AccountService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.prevUrl = this.routeringService.getPreviousUrl();
  }

  goToPortal(): void {
    if (this.accountService.isLoggedInV2()) {
      this.router.navigateByUrl('pages/dashboard');
    } else {
      this.router.navigateByUrl('auth/login');
    }
  }

  goToPrevUrl() {
    if (this.accountService.isLoggedInV2()) {
      if (this.prevUrl === '/auth/policy' || this.prevUrl === '/') {
        this.router.navigateByUrl('pages/dashboard');
      } else {
this.router.navigateByUrl(this.prevUrl);
}
    } else {
      this.router.navigateByUrl('auth/login');
    }
  }
}
