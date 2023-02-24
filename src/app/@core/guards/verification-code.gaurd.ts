import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { RoutingService } from '../../services/routing.service';

@Injectable({
    providedIn: 'root',
})
export class VerificationCodeGuard implements CanActivate {

    constructor(
        private accountService: AccountService,
        private router: Router,
        private routingService: RoutingService
        ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {
        if (sessionStorage.getItem('allow-verification')) {
return of(true);
}
        this.router.navigate(['auth/unauthorized'], {});
    }
}
