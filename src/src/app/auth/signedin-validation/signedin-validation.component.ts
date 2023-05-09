import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'ngx-signedin-validation',
  templateUrl: './signedin-validation.component.html',
  styleUrls: ['./signedin-validation.component.scss']
})
export class SignedinValidationComponent implements OnInit {

  isSignedIn = false;
  isProcessed = false;
  message = '';
  firstName: string;
  lastName: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.readSignedInFlags();
  }

  onGoToLogin() {
    this.accountService.isLoggedInV2().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigateByUrl('auth/is-logged-in');
      } else {
this.router.navigateByUrl('auth/login');
}
    }, error => {
    });
  }

  readSignedInFlags() {
    this.isProcessed = (/true/i).test(localStorage.getItem('isProcessed'));
    this.message = localStorage.getItem('message');
    this.firstName = this.accountService.loadedUser.firstName;
    this.lastName = this.accountService.loadedUser.lastName;
  }

  onLogOut() {
    this.router.navigateByUrl('auth/logout');
    // this.accountService.logout(true, () => {
    //   this.router.navigateByUrl('/auth/login');
    // });
  }
}
