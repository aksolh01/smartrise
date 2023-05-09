import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { StorageConstants } from "../_shared/constants";
import { ISelectableAccountInfo } from "../_shared/models/IUser";

Injectable()
export class MultiAccountsService {

    private accounts: ISelectableAccountInfo[];

    accountSelectionChangedSubject = new Subject<number | null>();
    accountSelectionChanged$ = this.accountSelectionChangedSubject.asObservable();

    setAccounts(accounts: ISelectableAccountInfo[]) {
        this.accounts = accounts;
    }

    hasSelectedAccount(): boolean {
        return this.getSelectedAccount() !== null;
    }

    setSelectedAccount(accountId: number) {
        if (this.accounts.length === 0) {
            return;
        }

        if (this.accounts.some(acc => acc.accountId === accountId) == false) {
            throw new Error(`Account Id ${accountId} is not found in the list`);
        }

        this.accountSelectionChangedSubject.next(accountId);
        localStorage.setItem(StorageConstants.SelectedAccount, accountId.toString());
    }

    clearSelectedAccount() {
        localStorage.removeItem(StorageConstants.SelectedAccount);
    }

    getSelectedAccount(): number | null {
        const selectedAccountValue = localStorage.getItem(StorageConstants.SelectedAccount);

        if (selectedAccountValue == null) return null;

        const selectedValue = +selectedAccountValue;

        if (this.accounts.some(acc => acc.accountId === selectedValue) == false) {
            this.clearSelectedAccount();
            return null;
        }

        return selectedValue;
    }

    getAccountsCount(): number {
        if (!this.accounts) {
            return 0;
        }
        return this.accounts.length;
    }

    hasOneAccount() {
        return this.getAccountsCount() === 1;
    }

    hasManyAccountsAndOneSelectedAccountOrHasOnlyOneAccount(): boolean {
        return (this.accounts != null && this.accounts.length > 1 && this.getSelectedAccount() != null) ||
            this.hasOneAccount();
    }

    hasMultipleAccounts() {
        return this.getAccountsCount() > 1;
    }

    getSelectedAccountOrDefaultValue(defaultValue: number) {
        return this.getSelectedAccount() == null
            ? defaultValue
            : this.getSelectedAccount();
    }

    hasManyAccountsAndOneSelectedAccount(): boolean {
        return this.accounts != null && this.accounts.length > 1 && this.getSelectedAccount() != null;
    }

    hasManyAccountsAndNoSelectedAccount(): boolean {
        return this.accounts != null && this.accounts.length > 1 && this.getSelectedAccount() == null;
    }

    getSelectedAccountName() {
        const selectedAccountId = this.getSelectedAccount();
        const selectedAccount = this.accounts.find(acc => acc.accountId === selectedAccountId);
        return selectedAccount?.name;
    }
}
