import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { QuotingToolComponent } from '../../pages/quotes-management/quoting-tool/quoting-tool.component';
import { TokenService } from '../../services/token.service';

@Injectable()
export class LeaveGuard implements CanDeactivate<QuotingToolComponent> {

    constructor(private tokenService: TokenService) {

    }

    canDeactivate(component: QuotingToolComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(!this.tokenService.getToken()) {
            return true;
        }
        if(!component.canLeave()) {
            component.notifyLeave(nextState.url);
        } else {
            return true;
        }
    }
}
