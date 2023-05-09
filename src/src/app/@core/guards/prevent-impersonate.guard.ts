import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PERMISSIONS, URLs } from '../../_shared/constants';
import { AccountService } from '../../services/account.service';
import { PermissionService } from '../../services/permission.service';
import { TokenService } from '../../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class PreventImpersonateGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private permissionService: PermissionService,
        private accountService: AccountService,
        private tokenService: TokenService
    ) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const user = await this.accountService.loadCurrentUser(this.tokenService.getToken()).toPromise();
        if (user.impersonationModeIsActivated) {
            this.router.navigate(['auth/unauthorized'], {});
        }
        return true;
    }

    // handleUnauthorized(evaluation: boolean | Promise<boolean>) {
    //     if (!evaluation)
    //     return true;
    // }

    async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return await this.canActivate(childRoute, state);
    }

    private async _checkByRoute(url: string): Promise<boolean> {
        let authenticated = false;

        if (url === URLs.HomeURL) {
            authenticated = true;
        } else if (url === URLs.BusinessSettingsURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.BusinessSettingsDisplay);
        } else if (url === URLs.JobsURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.JobsListing);
        } else if (url.startsWith('/pages/jobs-management/jobs/')) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.JobsListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.JobsDetail);
        } else if (url === URLs.SmartriseUsersURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.SmartriseUsersListing);
} else if (url === '/pages/settings-management/smartrise-users/create-smartrise-user') {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.SmartriseUsersListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.SmartriseUsersCreate);
} else if (url.startsWith('/pages/settings-management/smartrise-users/')) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.SmartriseUsersListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.SmartriseUsersUpdate);
} else if (url === URLs.CustomerUsersURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerUsersListing);
} else if (url === '/pages/settings-management/customer-users/create-customer-user') {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerUsersListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerUsersCreate);
} else if (url.startsWith('/pages/settings-management/customer-users/')) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerUsersListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerUsersUpdate);
} else if (url === URLs.SystemSettingsURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.SystemSettingsDisplay);
} else if (url === URLs.CompanyInfoURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CompanyInfoDisplay);
} else if (url === URLs.TrackingURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.TrackingListing);
} else if (url === URLs.ViewResourcesURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ViewResourcesList);
} else if (url === URLs.ViewCustomersURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing);
} else if (url === URLs.ViewJobFilesURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ManageJobFiles);
} else if (url === '/pages/customers-management/customers/createaccount') {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.AdministratorAccountCreate);
} else if (url.startsWith('/pages/customers-management/customers/')) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerDetail);
} else if (url === URLs.ViewUserActivities) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.UserActivitiesListing);
} else if (url === URLs.ViewOpenQuotesURL) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.OpenQuotesListing);
} else if (url.startsWith(URLs.ViewOpenQuotesURL)) {
authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.OpenQuoteDetails);
}

        if (!authenticated) {
            this.router.navigate(['auth/unauthorized'], {});
        } else {
            return authenticated;
        }
    }

    private _shouldGoToDefault(): string | false {
        const defaultUrl = localStorage.getItem('selectDefaultUrl');
        if (this.tokenService.rolesChanged) {
            this.tokenService.rolesChanged = false;
            return this.permissionService.getDefaultRoute();
        }
        if (defaultUrl != null) {
            localStorage.removeItem('selectDefaultUrl');
            return this.permissionService.getDefaultRoute();
        }

        return false;
    }
}
