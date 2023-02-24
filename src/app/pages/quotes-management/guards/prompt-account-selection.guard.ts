import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { map, tap } from "rxjs/operators";
import { SelectAccountComponent } from "../../../@theme/components/select-account/select-account.component";
import { AccountService } from "../../../services/account.service";
import { MultiAccountsService } from "../../../services/multi-accounts-service";
import { PERMISSIONS, URLs } from "../../../_shared/constants";
import { IUserAccountLookup } from "../../../_shared/models/IUser";

@Injectable({
    providedIn: 'root'
})
export class PromptAccountSelection implements CanActivate {

    accounts: IUserAccountLookup[];

    constructor(
        private accountService: AccountService,
        private multiAccountsService: MultiAccountsService,
        private router: Router,
        private modalService: BsModalService
    ) {

    }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean | UrlTree> {

        if (this._accountIdAlreadySelected()) {
            return true;
        }

        if (this.multiAccountsService.hasMultipleAccounts()) {
            await this._loadUserAccounts();
            const accountsWithSaveOnlineQuotePermission = this._getAccountsWithSaveOnlineQuotePermission();

            if (accountsWithSaveOnlineQuotePermission.length === 1) {
                const account = accountsWithSaveOnlineQuotePermission[0];
                this._saveAccountInfoToStorage(account.accountId);
                return true;
            }

            if (accountsWithSaveOnlineQuotePermission.length === 0) {
                this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
                return false;
            }

            const selectedAccount = await this._showSelectAccountPopup(accountsWithSaveOnlineQuotePermission);
            if (selectedAccount) {
                this._saveAccountInfoToStorage(selectedAccount);
                return true;
            } else {
                this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
                return false;
            }
        }

        if (!await this._selectedAccountHasSaveOnlineQuotePermission()) {
            this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
            return false;
        }

        return true;
    }

    private _accountIdAlreadySelected() {
        if (sessionStorage.getItem('CreateQuoteSelectedAccount')) {
            return true;
        }
        return false;
    }

    private _showSelectAccountPopup(accountsWithSaveOnlineQuotePermission: IUserAccountLookup[]): Promise<number | null> {
        return new Promise((resolve, reject) => {
            const modelRef = this.modalService.show<SelectAccountComponent>(SelectAccountComponent, {
                initialState: {
                    hideAllOption: true,
                    accounts: accountsWithSaveOnlineQuotePermission
                }
            });

            modelRef.onHide.subscribe(() => {
                if (modelRef.content.selectionChangeApplied()) {
                    resolve(modelRef.content.selectedAccount);
                } else {
                    resolve(null);
                }
            });
        });
    }

    private _saveAccountInfoToStorage(accountId: number) {
        sessionStorage.setItem('CreateQuoteSelectedAccount', accountId.toString());
        sessionStorage.setItem('CreateQuoteSelectedAccountName', this._getAccountNameFromId(accountId));
    }

    private _getAccountNameFromId(accountId: number): string {
        return this.accounts.find(ac => ac.accountId === accountId)?.name;
    }

    private async _selectedAccountHasSaveOnlineQuotePermission() {
        const selectedAccountId = this.multiAccountsService.getSelectedAccount();
        await this._loadUserAccounts();
        const account = this._getAccountById(selectedAccountId);
        return account.permissions.some(p => p === PERMISSIONS.SaveOnlineQuote);
    }

    private _getAccountById(accountId: number) {
        return this.accounts.find(acc => acc.accountId === accountId);
    }

    private _loadUserAccounts() {
        return this.accountService
            .loadCurrentUser()
            .pipe(
                tap(user => this.accounts = user.accounts)
            ).toPromise();
    }

    private _getAccountsWithSaveOnlineQuotePermission() {
        return this.accounts.filter(acc => acc.permissions.some(p => p === PERMISSIONS.SaveOnlineQuote));
    }
}