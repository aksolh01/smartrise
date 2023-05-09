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

    private _dictionary = new Map<(url: string) => boolean, () => Promise<boolean> | boolean>();

    constructor(
        private router: Router,
        private permissionService: PermissionService,
        private miscellaneousService: MiscellaneousService,
        private accountService: AccountService,
        private multiAccountsService: MultiAccountsService,
        private tokenService: TokenService
    ) {
        this._initializeDictionary();
        multiAccountsService.accountSelectionChanged$.subscribe(accountId => {
            this._redirectToDashboard = true;
        });
    }

    private _initializeDictionary() {
        this._dictionary.set((url) => url === URLs.EditProfile, () => true);
        this._dictionary.set((url) => url.startsWith('/pages/predictive-maintenance') || url.startsWith('/pages/not-found'), () => true);
        this._dictionary.set((url) => url === URLs.HomeURL, () => true);
        this._dictionary.set((url) => url === URLs.BusinessSettingsURL, async () => await this._hasPermissionAsync(PERMISSIONS.BusinessSettingsDisplay));
        this._dictionary.set((url) => url === URLs.JobsURL, async () => await this._hasPermissionAsync(PERMISSIONS.JobsListing));
        this._dictionary.set((url) => url === URLs.GeneratePasscode, async () => await this._hasPermissionAsync(PERMISSIONS.GeneratePasscode));
        this._dictionary.set((url) => url.startsWith('/pages/jobs-management/jobs/') ||
            url.startsWith('/pages/jobs-management/shipments/') ||
            url.startsWith('/pages/jobs-management/job-files/'), async () => await this._hasPermissionAsync(PERMISSIONS.JobsListing) && await this._hasPermissionAsync(PERMISSIONS.JobsDetail));
        this._dictionary.set((url) => url === URLs.SmartriseUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.SmartriseUsersListing));
        this._dictionary.set((url) => url === '/pages/settings-management/smartrise-users/create-smartrise-user', async () => await this._hasPermissionAsync(PERMISSIONS.SmartriseUsersListing) &&
            await this._hasPermissionAsync(PERMISSIONS.SmartriseUsersCreate));
        this._dictionary.set((url) => url.startsWith('/pages/settings-management/smartrise-users/'), async () => await this._hasPermissionAsync(PERMISSIONS.SmartriseUsersListing) &&
            await this._hasPermissionAsync(PERMISSIONS.SmartriseUsersUpdate));
        this._dictionary.set((url) => url === URLs.CustomerUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.CustomerUsersListing));
        this._dictionary.set((url) => url === URLs.CreateCustomerUserURL, async () => await this._hasPermissionAsync(PERMISSIONS.CustomerUsersListing) &&
            await this._hasPermissionAsync(PERMISSIONS.CustomerUsersCreate));
        this._dictionary.set((url) => url === URLs.CustomerUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.CustomerUsersListing));
        this._dictionary.set((url) => this._match(url, `${URLs.CustomerUsersURL}\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`), async () => await this._hasPermissionAsync(PERMISSIONS.CustomerUsersListing) &&
            await this._hasPermissionAsync(PERMISSIONS.CustomerUsersUpdate));
        this._dictionary.set((url) => url === URLs.SystemSettingsURL, async () => await this._hasPermissionAsync(PERMISSIONS.SystemSettingsDisplay));
        this._dictionary.set((url) => url.startsWith(URLs.CompanyInfoURL), async () => await this._hasPermissionAsync(PERMISSIONS.CompanyInfoDisplay));
        this._dictionary.set((url) => url === URLs.TrackingURL, async () => await this._hasPermissionAsync(PERMISSIONS.TrackingListing));
        this._dictionary.set((url) => url === URLs.ViewResourcesURL, async () => await this._hasPermissionAsync(PERMISSIONS.ViewResourcesList));
        this._dictionary.set((url) => url === URLs.ViewCustomersURL, async () => await this._hasPermissionAsync(PERMISSIONS.CustomerListing));
        this._dictionary.set((url) => url === URLs.ViewJobFilesURL, async () => await this._hasPermissionAsync(PERMISSIONS.ManageJobFiles));
        this._dictionary.set((url) => url === URLs.ViewInvoicesURL, () => true);
        this._dictionary.set((url) => url === URLs.ViewPaymentsURL, () => true);
        this._dictionary.set((url) => url === URLs.ViewStatementOfAccountURL, async () => await this._hasPermissionAsync(PERMISSIONS.StatementOfAccount));
        this._dictionary.set((url) => this._match(url, `${URLs.ViewStatementOfAccountURL}/[0-9]+`), async () => await this._hasPermissionAsync(PERMISSIONS.StatementOfAccount));
        this._dictionary.set((url) => url === URLs.ViewBillingInvoicesURL, async () => await this._hasPermissionAsync(PERMISSIONS.InvoicesListing));
        this._dictionary.set((url) => this._match(url, `${URLs.ViewBillingInvoicesURL}/[0-9]+`), async () => await this._hasPermissionAsync(PERMISSIONS.InvoicesListing));
        this._dictionary.set((url) => url === URLs.ViewBankAccountsURL, async () => await this._hasPermissionAsync(PERMISSIONS.ManageBankAccounts));
        this._dictionary.set((url) => url === URLs.CreateBankAccountURL, async () => await this._hasPermissionAsync(PERMISSIONS.ManageBankAccounts) && !this.miscellaneousService.isImpersonateMode());
        this._dictionary.set((url) => url.startsWith(URLs.EditBankAccountURL), async () => await this._hasPermissionAsync(PERMISSIONS.ManageBankAccounts) && !this.miscellaneousService.isImpersonateMode());
        this._dictionary.set((url) => this._match(url, `${URLs.ViewBankAccountsURL}/[0-9]+`), async () => await this._hasPermissionAsync(PERMISSIONS.ManageBankAccounts));
        this._dictionary.set((url) => url === '/pages/customers-management/customers/createaccount', async () => await this._hasPermissionAsync(PERMISSIONS.CustomerListing) &&
            await this._hasPermissionAsync(PERMISSIONS.AdministratorAccountCreate));
        this._dictionary.set((url) => url.startsWith('/pages/customers-management/customers/'), async () => await this._hasPermissionAsync(PERMISSIONS.CustomerListing) &&
            await this._hasPermissionAsync(PERMISSIONS.CustomerDetail));
        this._dictionary.set((url) => url === URLs.ViewUserActivities, async () => await this._hasPermissionAsync(PERMISSIONS.UserActivitiesListing));
        this._dictionary.set((url) => this._compareOpenQuoteUrl(url, URLs.ViewOpenQuotesURL), async () => await this._hasPermissionAsync(PERMISSIONS.OpenQuotesListing));
        this._dictionary.set((url) => url === URLs.CreateOnlineQuote, async () => await this._canCreateOnlineQuote());
        this._dictionary.set((url) => url.startsWith(URLs.CustomerOnlineQuote) && url.endsWith('view'), async () => await this._hasPermissionAsync(PERMISSIONS.ShowOnlineQuoteDetails));
        this._dictionary.set((url) => url.startsWith(URLs.CustomerOnlineQuote) && !url.endsWith('view'), async () => await this._customerCanAccessOnlineQuote());
        this._dictionary.set((url) => url.startsWith(URLs.ViewOpenQuotesURL), async () => await this._hasPermissionAsync(PERMISSIONS.OpenQuoteDetails));
        this._dictionary.set((url) => url.startsWith(URLs.SmartriseOnlineQuote), async () => await this._hasPermissionAsync(PERMISSIONS.OpenQuoteDetails));
        this._dictionary.set((url) => url === URLs.ViewAccountUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.AccountUsersListing));
        this._dictionary.set((url) => url === URLs.CreateAccountUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.AccountUsersCreate));
        this._dictionary.set((url) => url.startsWith(URLs.ViewAccountUsersURL) && url !== URLs.ViewAccountUsersURL, async () => await this._hasPermissionAsync(PERMISSIONS.AccountUsersUpdate));
    }

    private _match(url: string, pattern: string) {
        return new RegExp(`^${pattern}$`).test(url);
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

        for (const [checkUrl, validate] of this._dictionary.entries()) {
            if (checkUrl(url)) {
                authenticated = await validate();
                if (authenticated) {
                    break;
                }
            }
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
