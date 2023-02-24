import { EventEmitter, Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from '../pages/pages-menu';
import { PERMISSIONS } from '../_shared/constants';
import { MiscellaneousService } from './miscellaneous.service';
import { MultiAccountsService } from './multi-accounts-service';
import { PermissionService } from './permission.service';

@Injectable()
export class MenuService {

    menuGenerated = new EventEmitter<NbMenuItem[]>();
    private menu: NbMenuItem[] = [];

    constructor(
        private permissionService: PermissionService,
        private miscellaneousService: MiscellaneousService,
        private multiAccountService: MultiAccountsService
    ) {
    }

    generateMenus() {
        this.menu = MENU_ITEMS;
        this.hideUnauthorizedItems();
        return this.menu;
    }

    hideUnauthorizedItems() {
        this.menu.forEach(menuItem => {

            if (this._itemHasChildren(menuItem)) {

                menuItem.children.forEach(childMenuItem => this._hideShowItemBasedOnPermission(childMenuItem));

                menuItem.hidden = !this._hasVisibleChildren(menuItem);
            } else if (menuItem.data) {
                this._hideShowItemBasedOnPermission(menuItem);
            }
        });
    }

    private _hasVisibleChildren(menuItem: NbMenuItem) {
        return menuItem.children.some(cmi => !cmi.hidden);
    }

    private _itemHasChildren(menuItem: NbMenuItem) {
        return menuItem.children != null && menuItem.children.length > 0;
    }

    private _hideShowItemBasedOnPermission(ele: any) {
        if (this.multiAccountService.hasSelectedAccount()) {
            ele.hidden = !this.permissionService.hasPermissionInAccount(ele.data, this.multiAccountService.getSelectedAccount());
        } else {
            ele.hidden = !this.permissionService.hasPermission(ele.data);
        }
    }
}
