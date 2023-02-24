import { Injectable } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { AccountInfoComponent } from "../_shared/components/account-info/account-info.component";
import { ICustomerDetails } from "../_shared/models/customer-details";
import { CustomerService } from "./customer.service";

@Injectable()
export class AccountInfoService {

    constructor(
        private customerService: CustomerService,
        private modalService: BsModalService
        ) {

    }

    showAccountInfo(accountId: number) {
        this.customerService.getCompayInfoByAccountId(accountId).subscribe(companyInfo => {
            this._showAccountInfoPopup(companyInfo);
        });
    }

    private _showAccountInfoPopup(companyInfo: ICustomerDetails) {
        this.modalService.show(AccountInfoComponent, {
            initialState: {
                accountinfo: companyInfo
            },
            class: 'centered account-info-modal'
        });
    }
}