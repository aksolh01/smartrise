import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TokenService } from '../../services/token.service';
import { IAuthPageComponent } from '../auth-page.interface';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, IAuthPageComponent {

  constructor(
    private accountService: AccountService,
    private router: Router,
    private tokenService: TokenService,
    private route: ActivatedRoute,
  ) { }

  pageTitle: string;
  showPolicy?: boolean;

  ngOnInit(): void {
    this.route.queryParams.subscribe(x => {
      const rUrl = x['returnUrl'];
      setTimeout(() => {
        this.accountService.logout(false, () => {
          if (rUrl == null) {
            this.router.navigateByUrl('auth/login');
          } else {
            this.router.navigateByUrl(rUrl);
          }
        });
      }, 1000);
    });
  }
}
