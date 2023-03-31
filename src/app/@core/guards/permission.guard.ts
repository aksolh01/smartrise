import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PERMISSIONS, URLs } from '../../_shared/constants';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PermissionService } from '../../services/permission.service';
import { TokenService } from '../../services/token.service';
import { MultiAccountsService } from '../../services/multi-accounts-service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanActivateChild {

    private _redirectToDashboard: boolean;

    constructor(
        private router: Router,
        private permissionService: PermissionService,
        private miscellaneousService: MiscellaneousService,
        private accountService: AccountService,
        private multiAccountsService: MultiAccountsService,
        private tokenService: TokenService
    ) {
        multiAccountsService.accountSelectionChanged$.subscribe(accountId => {
            this._redirectToDashboard = true;
        });
    }


    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        this.accountService.checkSession();

        /* TODO: This code was supposed to fix Bug #6632.
        const currentUser = await this.accountService.currentUser$.pipe(take(1)).toPromise();

        if(currentUser.token != token) {
          console.log('Current token is different than saved token.');
          this.router.navigate(['/']);
          return false;
        }
        */

        const shouldGo = this._shouldGoToDefault();

        if (shouldGo !== false) {
            this.router.navigateByUrl(shouldGo);
            return false;
        }

        if (!this._permissionsLoaded()) {
            await this._loadPermissions();
        }

        return await this._checkByRoute(state.url);
    }

    private _permissionsLoaded() {
        return this.permissionService.permissions.length > 0;
    }

    private async _loadPermissions() {
        const user = await this.accountService.loadCurrentUser().toPromise();
        this.permissionService.setPermissions(user.accounts);
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

        if (
            url.startsWith('/pages/predictive-maintenance') ||
            url.startsWith('/pages/not-found')
        ) {
            return true;
        }

        if (url === URLs.HomeURL) {
            authenticated = true;
        }
        else if (url === URLs.EditProfile) {
            authenticated = true;
        } else if (url === URLs.BusinessSettingsURL) {
            authenticated = await this._hasPermissionAsync(PERMISSIONS.BusinessSettingsDisplay);
        } else if (url === URLs.JobsURL) {
            authenticated = await this._hasPermissionAsync(PERMISSIONS.JobsListing);
        } else if (
            url.startsWith('/pages/jobs-management/jobs/') ||
            url.startsWith('/pages/jobs-management/shipments/') ||
            url.startsWith('/pages/jobs-management/job-files/')
        ) {
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
        } else if (url.startsWith(URLs.ViewInvoicesURL)) {
            authenticated = true;
        } //await this.permissionService.hasPermission(PERMISSIONS.ViewInvoicesList);
        else if (url.startsWith(URLs.ViewPaymentsURL)) {
            authenticated = true;
        } //await this.permissionService.hasPermission(PERMISSIONS.ViewInvoicesList);
        else if (url.startsWith(URLs.ViewStatementOfAccountURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.StatementOfAccount);
        } else if (url.startsWith(URLs.ViewBillingInvoicesURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.InvoicesListing);
        } else if (url === URLs.ViewBankAccountsURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ManageBankAccounts);
        } else if (url === URLs.CreateBankAccountURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ManageBankAccounts) && !this.miscellaneousService.isImpersonateMode();
        } else if (url.startsWith(URLs.EditBankAccountURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ManageBankAccounts) && !this.miscellaneousService.isImpersonateMode();
        } else if (url.startsWith(URLs.ViewBankAccountsURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ManageBankAccounts);
        } else if (url === '/pages/customers-management/customers/createaccount') {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.AdministratorAccountCreate);
        } else if (url.startsWith('/pages/customers-management/customers/')) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerListing) &&
                await this.permissionService.hasPermissionAsync(PERMISSIONS.CustomerDetail);
        } else if (url === URLs.ViewUserActivities) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.UserActivitiesListing);
        } else if (this._compareOpenQuoteUrl(url, URLs.ViewOpenQuotesURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.OpenQuotesListing);
        } else if (url === URLs.CreateOnlineQuote) {
            authenticated = await this._canCreateOnlineQuote();
        } else if (url.startsWith(URLs.CustomerOnlineQuote) && url.endsWith('view')) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.ShowOnlineQuoteDetails);
        } else if (url.startsWith(URLs.CustomerOnlineQuote)) {
            authenticated = await this._customerCanAccessOnlineQuote();
        } else if (url.startsWith(URLs.ViewOpenQuotesURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.OpenQuoteDetails);
        } else if (url.startsWith(URLs.SmartriseOnlineQuote)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.OpenQuoteDetails);
        } else if (url === URLs.ViewAccountUsersURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.AccountUsersListing);
        } else if (url === URLs.CreateAccountUsersURL) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.AccountUsersCreate);
        } else if (url.startsWith(URLs.ViewAccountUsersURL)) {
            authenticated = await this.permissionService.hasPermissionAsync(PERMISSIONS.AccountUsersUpdate);
        }

        if (!authenticated) {
            this._handleUnauthorizedAccess();
        } else {
            return authenticated;
        }
    }

    private _handleUnauthorizedAccess() {
        if (this._redirectToDashboard) {
            this._navigateToHomePage();
        } else {
            this.accountService.logoutFromAllTabs();
        }
    }

    private _navigateToHomePage() {
        this._redirectToDashboard = false;
        this.router.navigateByUrl(URLs.HomeURL);
    }

    private async _hasPermissionAsync(permission: string): Promise<boolean> {

        if (this.miscellaneousService.isCustomerUser() &&
            this.multiAccountsService.hasManyAccountsAndOneSelectedAccount()) {
            return await this.permissionService.hasPermissionInAccountAsync(permission,
                this.multiAccountsService.getSelectedAccount());
        }

        return await this.permissionService.hasPermissionAsync(permission);
    }

    private async _canCreateOnlineQuote() {
        return await this._hasPermissionAsync(PERMISSIONS.SaveOnlineQuote)
            && !this.miscellaneousService.isImpersonateMode()
            && !this.miscellaneousService.isSmartriseUser();
    }

    private async _customerCanAccessOnlineQuote() {
        return await this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote)
            && !this.miscellaneousService.isImpersonateMode()
            && !this.miscellaneousService.isSmartriseUser();
    }

    private _compareOpenQuoteUrl(url: string, ViewOpenQuotesURL: string): boolean {
        const frags = url.split('?');
        if (frags.length > 0 && frags[0] === ViewOpenQuotesURL) {
            return true;
        }
        return false;
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
