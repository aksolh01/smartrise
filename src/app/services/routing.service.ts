import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { StorageConstants } from '../_shared/constants';

/** A router wrapper, adding extra functions. */
@Injectable()
export class RoutingService {

    private previousUrl: string = undefined;
    private currentUrl: string = undefined;

    constructor(private router: Router) {
        this.currentUrl = this.router.url;
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                sessionStorage.removeItem(StorageConstants.IsPreventOnLogin);
                sessionStorage.removeItem(StorageConstants.IsPreventOnLogout);
            }
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            }
            if (event instanceof NavigationCancel) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            }
        });
    }

    public getPreviousUrl() {
        return this.previousUrl;
    }

    public getCurrentUrl() {
        return this.currentUrl;
    }

    public reloadCurrentRoute() {
        const currentRoute = this.router.url;

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentRoute);
        });
    }
}
