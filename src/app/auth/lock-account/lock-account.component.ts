import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-lock-account',
  templateUrl: './lock-account.component.html',
  styleUrls: ['./lock-account.component.scss']
})
export class LockAccountComponent implements OnInit, IAuthPageComponent {
  successMessage: string;
  errorMessage: string;
  private _email: any;
  private _token: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    private _route: ActivatedRoute,
  ) { }

  pageTitle = 'Lock Account';
  showPolicy?: boolean;

  showForm = false;

  ngOnInit(): void {
    this._email = this._route.snapshot.queryParams['email'];
    this._token = this._route.snapshot.queryParams['token'];
    if (!this._email || !this._token) {
this.router.navigateByUrl('auth/unauthorized');
}
    this.accountService.validateTokes({
      token: this._token,
      email: this._email,
      tokenType: 'LockAccountToken',
    }).subscribe(r => {
      this.showForm = true;
    }, error => {
      this.showForm = false;
      this.errorMessage = error?.error?.message;
    });
  }

  onSubmit() {

    this.accountService.lockAccount({
      email: this._email,
      token: this._token
    }).subscribe(res => {
      this.successMessage = res.message;
    }, error => {
      this.errorMessage = error?.error?.message;
    });
  }

  backToLogin() {
    this.router.navigateByUrl('auth/login');
  }
}
