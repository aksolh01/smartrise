/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mapper } from '@nartc/automapper';
import { fromEvent } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CommonProfile } from './mappings/common-mapping-profile';
import { QuoteProfile } from './mappings/quote-mapping-profile';
import { AccountService } from './services/account.service';
import { MessageService } from './services/message.service';
import { MultiAccountsService } from './services/multi-accounts-service';
import { PermissionService } from './services/permission.service';
import { TitleService } from './services/title.service';
import { TokenService } from './services/token.service';
import { RoutingService } from './services/routing.service';
import { StorageConstants } from './_shared/constants';

@Component({
  selector: 'ngx-app',
  template: `
  <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'angulartitle';

  constructor(
    private accountService: AccountService,
    private permissionService: PermissionService,
    private router: Router,
    private titleService: TitleService,
    private tokenService: TokenService,
    private multiAccountService: MultiAccountsService,
    private messageService: MessageService,
    private routingService: RoutingService
  ) {
    Mapper.addProfile(QuoteProfile);
    Mapper.addProfile(CommonProfile);
  }

  async ngOnInit() {

    this.titleService.updatePageTitle();
    this.shareSessionStorageAmongTabs();
    const userLoggedIn = await this.accountService.isLoggedInV2().toPromise();
    if (userLoggedIn) {
      const refreshToken = await this.accountService.refreshToken().toPromise();
      this.tokenService.saveToken(refreshToken.newToken);
    }
  }

  loadCurrentUser(callback?: () => void) {

    const token = this.tokenService.getToken();

    if (token) {
      this.accountService
        .loadCurrentUser(token)
        .pipe(
          tap(user => this._setUserAccounts(user.accounts)),
        )
        .subscribe(
          (perms) => {

            this.permissionService.setPermissions(perms.accounts);

            if (callback && typeof callback === 'function') {
              callback();
            }

            this.accountService.changeUser();
          },
          (error) => {
            if (error.status === 500) {
              this.tokenService.clearToken();
              this.router.navigateByUrl('auth/login');
            }
          },
        );
    }
  }

  private _setUserAccounts(accounts: any): void {
    this.multiAccountService.setAccounts(accounts?.map(acc => acc.accountId));
  }

  shareSessionStorageAmongTabs(): void {
    // source: http://blog.guya.net/2015/06/12/sharing-sessionstorage-between-tabs-for-secure-multi-tab-authentication/

    if (!sessionStorage.length) {
      // New tab opened with remember me set to false
      localStorage.setItem(StorageConstants.GetSessionStorage, Date.now().toString());
    } else {
      this.loadCurrentUser();
    }

    fromEvent(window, 'storage')
      .pipe(
        filter((event: StorageEvent) => event.key === StorageConstants.GENERATEFILE)
      ).subscribe(() => {
        this.messageService.showSuccessMessage(StorageConstants.GENERATEFILE);
      });

    fromEvent(window, 'storage')
      .pipe(
        filter((event: StorageEvent) => event.key === StorageConstants.LOGIN)
      ).subscribe(() => {
      });

    fromEvent(window, 'storage')
      .pipe(
        filter((event: StorageEvent) =>
          event.key === StorageConstants.GetSessionStorage ||
          event.key === StorageConstants.SessionStorage ||
          event.key === StorageConstants.SessionExpired ||
          event.key === StorageConstants.SelectedAccount ||
          event.key === StorageConstants.JwtToken)
      )
      .subscribe((event: StorageEvent) => {
        this._onStorageEvent(event, () => {
          this.loadCurrentUser(() => {
            if (this.router.url.indexOf('auth/login') >= 0) {
              this.router.navigate(['/', 'pages', 'dashboard']);
            }

            // if (location.pathname.indexOf('auth/login') >= 0) {
            //   this.router.navigate(['/', 'pages', 'dashboard']);
            // }

            if (this.tokenService.getProperty('RolesChanged')) {
              location.reload();
            }
          });
        });
      });
  }

  private _onStorageEvent(event: StorageEvent, callback: () => void): void {

    if (event.key === StorageConstants.SessionExpired) {
      this.accountService.logout(false);
      this.router.navigateByUrl('auth/login', {
        state: {
          sessionExpired: true
        }
      });
      return;
    }

    if (event.key === StorageConstants.SelectedAccount) {
      this.routingService.reloadCurrentRoute();
      return;
    }

    if (event.key === StorageConstants.SelectedAccount) {
      this.routingService.reloadCurrentRoute();
      return;
    }

    //We replaced the old logout behavior with the below
    //`this.router.navigateByUrl('auth/logout');` to unify the solve
    //the issue of Existing from quoting tool

    if (event.key === StorageConstants.GetSessionStorage) {
      // Some tab asked for the sessionStorage -> send it
      this.tokenService.shareSessionStorage();
    } else if (event.key === StorageConstants.SessionStorage && event.newValue !== null) {
      // SessionStorage is Empty -> fill it
      if (JSON.stringify(event.newValue) === '{}' || event.newValue === StorageConstants.LOGOUT) {
        if (this.router.url !== 'auth/policy') {
this.router.navigateByUrl('auth/logout');
}
      } else if (event.newValue) {
        const data = JSON.parse(event.newValue);

        if (Object.keys(data).length === 0) {
          if (this.router.url !== 'auth/policy') {
this.router.navigateByUrl('auth/logout');
}
        }

        if (data && data[StorageConstants.JwtToken] && data[StorageConstants.JwtToken] !== this.tokenService.getToken()) {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              sessionStorage.setItem(key, data[key]);
            }
          }
          callback();
        }
      }
    } else if (event.key === StorageConstants.JwtToken) {
      // Remember me is true token is saved in localStorage
      if (!event.newValue || JSON.stringify(event.newValue) === '{}' || event.newValue === StorageConstants.LOGOUT) {
        // Logout action occured.
        this.router.navigateByUrl('auth/logout');
      } else if (event.newValue && event.newValue !== event.oldValue) {
        // Token is changed reloadCurrentUser
        callback();
      }
    }
  }
}
