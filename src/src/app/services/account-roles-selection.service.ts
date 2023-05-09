import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { IRole } from '../_shared/models/role';

@Injectable({ providedIn: 'root' })
export class AccountRolesSelectionService {
  accountSelected$ = new Subject<any>();
  removeAccount$ = new Subject<any>();
  change$ = new Subject<void>();
  roles$ = new ReplaySubject<IRole[]>();

  bubbleUpChangeNotification() {
    this.change$.next();
  }

  removeAccount(rowData: any) {
    this.removeAccount$.next(rowData);
  }
}
