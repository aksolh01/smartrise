import { DatePipe } from '@angular/common';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { ITextValueLookup } from '../_shared/models/text-value.lookup';
import { BaseComponentService } from '../services/base-component.service';
import { PermissionService } from '../services/permission.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IPagination } from '../_shared/models/pagination';
import { MultiAccountsService } from '../services/multi-accounts-service';
import { MiscellaneousService } from '../services/miscellaneous.service';

export class BaseComponent {

  private __permissionService: PermissionService;

  private __datePipe: DatePipe;
  private __router: Router;
  private __multiAccountService: MultiAccountsService;
  private __miscellaneousService: MiscellaneousService;

  constructor(baseComponentService: BaseComponentService) {
    this.__permissionService = baseComponentService.permissionService;
    this.__datePipe = baseComponentService.datePipe;
    this.__router = baseComponentService.router;
    this.__multiAccountService = baseComponentService.multiAccountService;
    this.__miscellaneousService = baseComponentService.miscellaneousService;
  }

  maskInput(e) {
    const mask = e.target.mask;
    const value = e.target.value;

    for (let index = 0; index < value.length; index++) {
      const valueElement = value[index];
      const maskElement = mask[index];
      if (maskElement === '9') {
        if (isNaN(+valueElement)) {
          e.preventDefault();
          return;
        }
      } else if (maskElement === 'a') {
        if (!/[a-zA-Z]/.test(valueElement)) {
          e.preventDefault();
          return;
        }
      } else {
        if (valueElement !== maskElement) {
          e.preventDefault();
          return;
        }
      }
    }
  }

  refreshPage() {
    const currentUrl = this.__router.url;
    this.__router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.__router.navigate([currentUrl]);
    });
  }

  getInstance<T>(error): T {
    if (!error?.error?.instance) {
      return null;
    }
    return JSON.parse(error.error.instance);
  }

  protected emptyData(): Observable<IPagination> {
    return of({
      data: [],
      count: 0,
      pageIndex: 1,
      pageSize: 1
    });
  }

  formatMoney(value: number) {
    return value.toString();
  }

  isEmpty(value: any) {
    return (value === '' || value === null || value === undefined);
  }

  getEnumDescription(enumValue: IEnumValue) {
    if (enumValue != null) {
      return enumValue.description;
    }
    return null;
  }

  mockUtcDate(date: Date) {

    if (date === new Date(1970, 1, 1)) {
      return null;
    }

    if (date !== null && date !== undefined) {
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    return date;
  }

  formatDate(date: string) {
    if (date) {
      const raw = new Date(date);
      return raw.toLocaleDateString();
      // var datePipe = new DatePipe('en-US');
      // return datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');
    }
    return '';
  }

  formatUSDate(date: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.__datePipe.transform(raw, 'MM/dd/yyyy');
      return formatted;
    }
    return '';
  }

  formatUSDateTimeWithoutSeconds(date: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.__datePipe.transform(raw, 'MM/dd/yyyy hh:mm aa');
      return formatted;
    }
    return '';
  }

  formatLocalDateTime(date: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.__datePipe.transform(raw, 'MM/dd/yyyy hh:mm:ss aa') + ' UTC';
      return this.formatUSDateTimeWithoutSeconds(new Date(formatted).toString());
    }
    return '';
  }

  formatUSDateTime(date: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.__datePipe.transform(raw, 'MM/dd/yyyy hh:mm:ss aa');
      return formatted;
    }
    return '';
  }

  formatDateTime(date: Date, format: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.__datePipe.transform(raw, format);
      return formatted;
    }
    return '';
  }

  disable(permission: string) {
    return this.__permissionService.hasPermission(permission) ? null : 'true';
  }

  populateLookup(lookup: ITextValueLookup[], type: any) {
    for (const item in type) {
      if (isNaN(Number(item))) {
        lookup.push({
          value: type[item],
          title: (item || '').replace(/([A-Z])/g, ' $1').trim(),
        });
      }
    }
  }

  populateLookupAsFilterListExcept(type: any, exceptedOptions: any[]): { value: number; title: string }[] {
    const keys = Object
      .keys(type);

    this.filterKeys(type, keys, exceptedOptions);

    return keys
      .filter(m => typeof (m) === 'string' && isNaN(Number(m)))
      .map(m => ({ title: this.addSpaces(m), value: type[m] }));
  }

  filterKeys(type: any, keys: string[], exceptedOptions: any[]) {
    exceptedOptions.forEach(x => {
      const index = keys.indexOf(type[x]);
      keys.splice(index, 1);
    });
  }

  populateLookupAsFilterList(type: any): { value: number; title: string }[] {
    const array = Object
      .keys(type)
      .filter(m => typeof (m) === 'string' && isNaN(Number(m)))
      .map(m => ({ title: this.addSpaces(m), value: type[m] }));

    return array;
    // let lookup: { value: number; title: string }[] = [];
    // let numbers: number[] = [];
    // let index: number = 0;
    // let isFirstText = true;
    // for (let item in type) {
    //   if (!isNaN(Number(item))) {
    //     numbers.push(+item);
    //   } else {
    //     if (isFirstText) {
    //       isFirstText = false;
    //       index = 0;
    //     }
    //     lookup.push({
    //       value: numbers[index],
    //       title: this.addSpaces(item)
    //     });
    //   }
    //   index++;
    // }
    // return lookup;
  }

  isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
  }


  protected addSpaces(text: string): string {
    return (text || '').replace(/([A-Z])/g, ' $1').trim();
  }

  populateYesNo(): { value?: boolean; title: string }[] {
    return [{
      title: 'Yes',
      value: true,
    }, {
      title: 'No',
      value: false,
    }];
  }

  getError(form, field, validation) {
    return form.get(field).errors != null &&
      form.get(field).errors[validation] &&
      form.get(field).touched;
  }

  getSelectedAccountsLabel() {
    const selectedAccountName = this.__multiAccountService.getSelectedAccountName();
    if (this.__miscellaneousService.isSmartriseUser()) {
      return '';
    }
    if (selectedAccountName) {
      return ` - ${selectedAccountName}`;
    }
    return ' - All Accounts'
  }
}
