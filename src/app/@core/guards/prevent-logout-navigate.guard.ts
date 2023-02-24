import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageConstants } from '../../_shared/constants';
import { AccountService } from '../../services/account.service';

@Injectable({
    providedIn: 'root'
})
export class PreventLoggedOutNavigateGuard implements CanActivate {

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        sessionStorage.setItem(StorageConstants.IsPreventOnLogout, StorageConstants.IsPreventOnLogout);
        return this.accountService.isLoggedInV2().pipe(
            map((auth) => {
                if (!auth) {
                    sessionStorage.setItem(StorageConstants.PreventedUrl, state.url);
                    this.router.navigate(['auth/unauthorized']);
                }
                return true;
            }),
        );
    }
}
