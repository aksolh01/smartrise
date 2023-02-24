import { IUser } from '../_shared/models/IUser';

export class PortalTitleService {

    public getPortalTitleService(user: IUser) {
        if (!user) {
            return 'Customer Portal';
        }

        if (user.isSmartriseUser) {
            if (!user.roles || user.roles.length === 0) {
                return 'Customer Portal';
            }

            if (user.roles.find(o => o === 'SmartriseBusinessAdministrator') ) {
                return 'Business Portal';
            } else if (user.roles.find(o => o === 'SmartriseAdministrator') ) {
                return 'Admin Portal';
            } else if (user.roles.find(o => o === 'SmartriseSalesManager') ) {
                return 'Sales Portal';
            } else if (user.roles.find(o => o === 'SmartriseSupport') ) {
                return 'Support Portal';
            } else if (user.roles.find(o => o === 'SmartriseAccountant') ) {
                return 'Accountant Portal';
            } else {
                return 'Customer Portal';
            }
        } else {
            return 'Customer Portal';
        }
    }
}
