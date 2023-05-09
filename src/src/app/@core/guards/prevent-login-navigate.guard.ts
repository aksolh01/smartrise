import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageConstants } from '../../_shared/constants';
import { AccountService } from '../../services/account.service';

@Injectable({
    providedIn: 'root'
})
export class PreventLoggedInNavigateGuard implements CanActivate {

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        sessionStorage.setItem(StorageConstants.IsPreventOnLogin, StorageConstants.IsPreventOnLogin);
        return this.accountService.isLoggedInV2().pipe(
            map((auth) => {
                if (auth) {

                    if (state.url.indexOf('auth/login') > -1) {
                        const rUrl = state.root.queryParams['returnUrl'];
                        if (rUrl) {
this.router.navigateByUrl(rUrl);
} else {
                            this.router.navigate(['pages/dashboard']);
                        }
                        return false;
                    }

                    sessionStorage.setItem(StorageConstants.PreventedUrl, state.url);
                    this.router.navigate(['auth/is-logged-in']);
                    return false;
                }
                return true;
            }),
        );
    }
}
