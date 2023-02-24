import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.accountService.isLoggedInV2().pipe(
      map((auth) => {
        if (auth) {
          return true;
        }
        this.router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url },
        });
      }),
    );
  }
}
