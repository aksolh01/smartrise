import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements IAuthPageComponent, OnInit {
  pageTitle = 'Unauthorized';
  showPolicy = false;
  isLoggedIn = false;

  constructor(private router: Router, private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.accountService.isLoggedInV2().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  goToHomePage() {
    this.router.navigateByUrl('/pages/dashboard');
  }
}
