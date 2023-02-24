import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../services/account.service';
import { MessageService } from '../../services/message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly cancelHttp = new Subject<void>();
  isLoggedOut = new Subject<void>();

  constructor(
    private router: Router,
    private toastr: NbToastrService,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {
  }

  showToast(position, status, message) {
    this.toastr.show(message, 'error', { position, status });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((response) => {
        if (response) {

          // 400 => Bad request => display error message from the server
          // 401 => Unauthorized => toast message + logout
          // 404 => redirect page "Item not found"
          // 500 => Internal server error


          if (response.status === 400) {
            if (response?.error?.message && this._canShowMessage(req.url)) {
              this.messageService.showErrorMessage(response?.error?.message);
            }
          } else if (response.status === 401) {
            if (this.router.url.indexOf('auth/login') === -1) {
              this.isLoggedOut.next();
            }
            this.accountService.logout(true, () => {
              if (this.router.url.indexOf('auth/login') > -1 && response?.error?.message) {
                this.messageService.showErrorMessage(response?.error?.message);
              } else {
                const sub = this.router.events.subscribe(e => {
                  if (e instanceof NavigationEnd) {
                    if (response?.error?.message !== null && response?.error?.message !== undefined && this._canShowMessage(req.url)) {
                      this.messageService.showErrorMessage(response?.error?.message);
                    }
                    sub.unsubscribe();
                  }
                });
              }
              const isSessionExpiry = this._isSessionExpiry(req.url);
              this.router.navigateByUrl('/auth/login', {
                state: {
                  sessionExpired: isSessionExpiry
                }
              });
            });
          } else if (response.status === 403) {
            if (this._canShowMessage(req.url)) {
              this.messageService.showErrorMessage(response?.error?.message);
            }
          } else if (response.status === 404) {
            this.router.navigateByUrl('/pages/not-found');
          } else if (response.status === 500) {
            if (this._canShowMessage(req.url) && response?.error?.message) {
              this.messageService.showErrorMessage(response?.error?.message);
            }
          } else if (response.status !== 0) {
            this.messageService.showErrorMessage('An error encountered');
          }

          if (response.status === 0 && response.statusText === 'Unknown Error') {
            this.messageService.showErrorMessage('Connection Interrupted.\nPlease check your internet connection');
            response.message = ('Connection Interrupted.\nPlease check your internet connection');
          }

          return throwError(response);
        }
      }),
    ).pipe(takeUntil(this.isLoggedOut.asObservable()));
  }

  private _isSessionExpiry(url: string) {
    const lenth = environment.apiUrl.length;
    const pUrl = url.substring(lenth, url.length);
    const hideSessionExpiry = [
      'account\/login',
      'account\/[0-9]+\/resendInvitationLink\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
      'account\/[0-9]+\/profile',
      'customerAccounting\/bankAccounts\/[0-9]+',
      'invoice\/[0-9]+',
      'jobs\/[0-9]+',
      'quotes\/[0-9]+',
      'quotes\/get\/[0-9]+',
      'openquotes\/[0-9]+'
    ];
    for (const f of hideSessionExpiry) {
      const reg = new RegExp(`^${f}$`, 'i');
      if (reg.test(pUrl)) {
        return false;
      }
    }
    return true;
  }

  private _canShowMessage(url: string): boolean {
    const lenth = environment.apiUrl.length;
    const pUrl = url.substring(lenth, url.length);
    const hideToastMessageUrls = [
      'account/tokenValidity',
    ];
    if (hideToastMessageUrls.indexOf(pUrl) > -1) {
      return false;
    }
    return true;
  }
}
