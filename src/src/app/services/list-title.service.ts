import { Injectable } from "@angular/core";
import { IUserAccountLookup } from "../_shared/models/IUser";
import { AccountService } from "./account.service";
import { MiscellaneousService } from "./miscellaneous.service";
import { MultiAccountsService } from './multi-accounts-service';

@Injectable({ providedIn: 'root' })
export class ListTitleService {

    constructor(
        private accountService: AccountService,
        private multiAccountService: MultiAccountsService,
        private miscellaneousService: MiscellaneousService
    ) { }

    async buildTitle(prefix: string) {

        if (this.miscellaneousService.isSmartriseUser()) {
            return prefix;
        }

        if (this.multiAccountService.hasSelectedAccount()) {
            return `${prefix} - ${this.multiAccountService.getSelectedAccountName()}`;
        } else if (this.multiAccountService.hasMultipleAccounts()) {
            return `${prefix} - All Accounts`;
        }
    }
}