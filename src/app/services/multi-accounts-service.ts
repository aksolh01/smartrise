import { Injectable } from "@angular/core";
import { StorageConstants } from "../_shared/constants";

Injectable()
export class MultiAccountsService {

    private accounts: number[];

    setAccounts(accountIds: number[]) {
        this.accounts = accountIds;
    }

    hasSelectedAccount(): boolean {
        return this.getSelectedAccount() !== null;
    }

    setSelectedAccount(accountId: number) {
        if (this.accounts.length === 0) {
            return;
        }

        if (this.accounts.includes(accountId) == false) {
            throw new Error(`Account Id ${accountId} is not found in the list`);
        }

        localStorage.setItem(StorageConstants.SelectedAccount, accountId.toString());
    }

    clearSelectedAccount() {
        localStorage.removeItem(StorageConstants.SelectedAccount);
    }

    getSelectedAccount(): number | null {
        const selectedAccountValue = localStorage.getItem(StorageConstants.SelectedAccount);

        if (selectedAccountValue == null) return null;

        const selectedValue = +selectedAccountValue;

        if (this.accounts.includes(selectedValue) == false) {
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
}
