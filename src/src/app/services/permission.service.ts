import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { URLs } from '../_shared/constants';
import { IAccoutPermissions } from '../_shared/models/permission.model';

@Injectable()
export class PermissionService {
    permissions: IAccoutPermissions[] = [];
    permissionsLoaded = new ReplaySubject(null);

    notifyPermissionsChanged() {
        this.permissionsLoaded.next(null);
    }

    setPermissions(permissions: IAccoutPermissions[]) {
        this.permissions = permissions;
        this.notifyPermissionsChanged();
    }

    getPermissions() {
        return this.permissions;
    }

    hasPermissionAsync(permission: string): Promise<boolean> {
        return of(this.hasPermission(permission)).toPromise();
    }

    hasPermission(permission: string): boolean {
        return this.permissions.some(acc => acc.permissions.some(p => p === permission));
    }

    hasPermissionInAccountAsync(permission: string, accountId: number): Promise<boolean> {
        return of(this.hasPermissionInAccount(permission, accountId)).toPromise();
    }

    hasPermissionInAccount(permission: string, accountId: number): boolean {
        const m = this.permissions.some(acc => acc.permissions.some(p => p === permission) && acc.accountId === accountId);
        return m;
    }

    getDefaultRoute() {
        return URLs.HomeURL;
    }
}
