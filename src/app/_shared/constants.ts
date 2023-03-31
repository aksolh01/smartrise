/* eslint-disable */
import { AbstractControl, UntypedFormControl } from '@angular/forms';

export const PERMISSIONS = {
  CustomerListing: 'CustomerListing',
  AccountUsersListing: 'AccountUsersListing',
  OpenQuotesListing: 'OpenQuotesListing',
  OpenQuoteDetails: 'OpenQuoteDetails',
  QuotingToolListing: 'QuotingToolListing',
  CustomerDetail: 'CustomerDetail',
  AdministratorAccountCreate: 'AdministratorAccountCreate',
  AdministratorAccountResetPassword: 'AdministratorAccountResetPassword',
  AdministratorAccountResendInvitationLink: 'AdministratorAccountResendInvitationLink',
  AdministratorAccountImpersonate: 'AdministratorAccountImpersonate',
  AdministratorAccountUpdate: 'AdministratorAccountUpdate',
  AdministratorAccountActivate: 'AdministratorAccountActivate',
  AdministratorAccountDeactivate: 'AdministratorAccountDeactivate',
  AccountUsersUpdate: 'AccountUsersUpdate',
  AccountUsersResendLink: 'AccountUsersResendLink',
  AccountUsersResetPassword: 'AccountUsersResetPassword',
  AccountUsersActivate: 'AccountUsersActivate',
  AccountUsersDeactivate: 'AccountUsersDeactivate',
  AccountUsersResendInvitation: 'AccountUsersResendInvitation',
  AccountUsersCreate: 'AccountUsersCreate',
  BusinessSettingsDisplay: 'BusinessSettingsDisplay',
  BusinessSettingsUpdate: 'BusinessSettingsUpdate',
  SystemSettingsDisplay: 'SystemSettingsDisplay',
  SystemSettingsUpdate: 'SystemSettingsUpdate',
  SmartriseUsersListing: 'SmartriseUsersListing',
  SmartriseUsersResetPassword: 'SmartriseUsersResetPassword',
  SmartriseUsersResendLink: 'SmartriseUsersResendLink',
  SmartriseUsersActivate: 'SmartriseUsersActivate',
  SmartriseUsersDeactivate: 'SmartriseUsersDeactivate',
  SmartriseUsersActivate2FA: 'SmartriseUsersActivate2FA',
  SmartriseUsersDeactivate2FA: 'SmartriseUsersDeactivate2FA',
  SmartriseUsersDetail: 'SmartriseUsersDetail',
  SmartriseUsersCreate: 'SmartriseUsersCreate',
  SmartriseUsersUpdate: 'SmartriseUsersUpdate',
  UserActivitiesListing: 'UserActivitiesListing',
  JobsListing: 'JobsListing',
  ViewInvoicesList: 'ViewInvoicesList',
  ViewPaymentsList: 'ViewPaymentsList',
  TrackingListing: 'TrackingListing',
  ViewResourcesList: 'ViewResourcesList',
  JobsDetail: 'JobsDetail',
  JobsDownloadResourceFiles: 'JobsDownloadResourceFiles',
  CustomerUsersListing: 'CustomerUsersListing',
  CustomerUsersResetPassword: 'CustomerUsersResetPassword',
  CustomerUsersResendInvitationLink: 'CustomerUsersResendInvitationLink',
  CustomerUsersActivate: 'CustomerUsersActivate',
  CustomerUsersDeactivate: 'CustomerUsersDeactivate',
  CustomerUsersActivate2FA: 'CustomerUsersActivate2FA',
  CustomerUsersDeactivate2FA: 'CustomerUsersDeactivate2FA',
  CustomerUsersDetail: 'CustomerUsersDetail',
  CustomerUsersCreate: 'CustomerUsersCreate',
  CustomerUsersUpdate: 'CustomerUsersUpdate',
  CompanyInfoDisplay: 'CompanyInfoDisplay',
  ManageJobFiles: 'ManageJobFiles',
  GenerateResourceFile: 'GenerateResourceFile',
  Login: 'Login',
  StatementOfAccount: 'StatementOfAccount',
  InvoicesListing: 'InvoicesListing',
  MakePayment: 'MakePayment',
  ManageBankAccounts: 'ManageBankAccounts',
  ShowOnlineQuotes: 'ShowOnlineQuotes',
  ShowOnlineQuoteDetails: 'ShowOnlineQuoteDetails',
  SaveOnlineQuote: 'SaveOnlineQuote',
};

// URLs
export const URLs = {
  ViewQuotesURL: '/pages/quotes-management/quotes',
  ViewOpenQuotesURL: '/pages/quotes-management/open-quotes',
  ShowOnlineQuotes: '/pages/quotes-management/quotes',
  CustomerOnlineQuote: '/pages/quotes-management/open-quotes/customer',
  SmartriseOnlineQuote: '/pages/quotes-management/open-quotes/smartrise',
  SaveOnlineQuote: '/pages/quotes-management/quotes/[0-9]+',
  CreateOnlineQuote: '/pages/quotes-management/request-quote',
  ViewCustomersURL: '/pages/customers-management/customers',
  ViewAccountUsersURL: '/pages/account-users-management/account-users',
  CreateAccountUsersURL: '/pages/account-users-management/account-users/createuser',
  BusinessSettingsURL: '/pages/settings-management/business-settings',
  SystemSettingsURL: '/pages/settings-management/system-settings',
  SmartriseUsersURL: '/pages/settings-management/smartrise-users',
  JobsURL: '/pages/jobs-management/jobs',
  TrackingURL: '/pages/jobs-management/shipments',
  ViewResourcesURL: '/pages/jobs-management/job-files',
  ViewInvoicesURL: '/pages/jobs-management/invoices',
  ViewPaymentsURL: '/pages/jobs-management/payments',
  LoginURL: '/auth/login',
  RegisterURL: '/auth/register',
  CustomerUsersURL: '/pages/settings-management/customer-users',
  ViewUserActivities: '/pages/audit-management/user-activities',
  RequestPasswordURL: '/auth/request-password',
  ResetPasswordURL: '/auth/reset-password',
  CompanyInfoURL: '/pages/settings-management/accounts',
  ViewJobFilesURL: '/pages/support-management/job-files',
  HomeURL: '/pages/dashboard',
  EditProfile: '/pages/edit-profile',
  ViewPMDashboardURL: '/pages/predictive-maintenance/dashboard',
  ViewPMJobsURL: '/pages/predictive-maintenance/jobs-list',
  ViewPMPartsURL: '/pages/predictive-maintenance/parts-review',
  ViewPMAlertsURL: '/pages/predictive-maintenance/alerts-list',
  ViewPMAlertSettingsURL: '/pages/predictive-maintenance/alert-settings',
  ViewPMNotificationSettingsURL: '/pages/predictive-maintenance/notification-settings',
  ViewStatementOfAccountURL: '/pages/billing/statement-of-account',
  ViewBillingInvoicesURL: '/pages/billing/invoices',
  ViewBankAccountsURL: '/pages/billing/bank-accounts',
  CreateBankAccountURL: '/pages/billing/bank-accounts/add',
  EditBankAccountURL: '/pages/billing/bank-accounts/edit',
};

export const SmartriseValidators = {
  emailRegex: /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  onlyAlphabet: /^[a-zA-Z\s-]*$/,
  lessThanToday: ((control: AbstractControl): { 'lessThanToday': boolean } => {
    if (!control.value || control.value?.toString()?.trim() === '') {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (control.value < today) {
      return { lessThanToday: true };
    }
  }),
  requiredWithTrim: ((control: AbstractControl): { 'requiredWithTrim': boolean } => {

    if (control.value === 0) {
      return null;
    }

    if (!control.value || control.value?.toString()?.trim() === '') {
      return {
        requiredWithTrim: (
          control.value?.trim() === '' ||
          control.value === undefined ||
          control.value === null
        )
      };
    }
    return null;
  }),
  routingNumber: ((control: UntypedFormControl): { 'routingNumber': boolean } => {

    if (control.value?.trim() === '') {
return null;
}

    const trimmedValue = control.value?.trim();
    if (trimmedValue != null && trimmedValue.length === 9) {
return null;
}

    return { routingNumber: true };
  }),
  whitespace: ((control: AbstractControl): { 'whitespace': boolean } => {

    if (control.value?.trim() === '' && control.value.length > 0) {
return { whitespace: true };
}

    return null;
  }),
  bankAccountNumber: ((control: UntypedFormControl): { 'bankAccountNumber': boolean } => {

    if (control.value?.trim() === '') {
return null;
}

    const trimmedValue = control.value?.trim();
    if (trimmedValue != null && trimmedValue.length <= 17 && trimmedValue.length > 5) {
return null;
}

    return { bankAccountNumber: true };
  }),
  greaterThanZero: ((control: UntypedFormControl): { 'greaterThanZero': boolean } => {

    if (control.value?.trim() === '') {
return null;
}

    const trimmedValue = control.value?.trim();
    if (trimmedValue === null || trimmedValue === undefined || trimmedValue === '') {
return null;
}

    if (+trimmedValue === 0) {
      return { greaterThanZero: true };
    }

    if (+trimmedValue > 0) {
      return null;
    }

    return { greaterThanZero: true };
  }),
  email: ((control: AbstractControl): { 'smartriseEmail': boolean } => {

    if (control.value === '') {
return { smartriseEmail: true };
}

    if (control.value?.trim() === '' && control.value.length > 0) {
return { smartriseEmail: true };
}

    const trimmedValue = control.value?.trim();
    const isValidEmail = trimmedValue.match(SmartriseValidators.emailRegex);
    if (isValidEmail != null && isValidEmail.length > 0) {
return null;
}

    return { smartriseEmail: true };
  }),
  smartriseEmail: ((control: AbstractControl): { 'smartriseEmail': boolean } => {

    if (control.value?.trim() === '') {
return null;
}

    const trimmedValue = control.value?.trim();
    if (trimmedValue === null || trimmedValue === undefined) {
      return null;
    }
    const isValidEmail = trimmedValue.match(SmartriseValidators.emailRegex);
    if (isValidEmail != null && isValidEmail.length > 0) {
return null;
}

    return { smartriseEmail: true };
  }),
  verificationCode: ((control: UntypedFormControl): { 'verificationCode': boolean } => {
    if (control.value?.trim() === '') {
return null;
}
    if (/^[0-9]{6}$/.test(control.value)) {
return null;
}
    return { verificationCode: true };
  }),
  creditCardNumber: ((control: UntypedFormControl): { 'creditCardNumber': boolean } => {
    if (control.value?.trim() === '') {
return null;
}
    if (/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/.test(control.value)) {
return null;
}
    return { creditCardNumber: true };
  }),
  trimError: (control: AbstractControl) => {

    if (!control) {
      return null;
    }

    if (!control.value) {
      return null;
    }

    if (!isNaN(control.value)) {
      return null;
    }

    if (control?.value?.trim() === '') {
return null;
}
    if (control?.value?.startsWith(' ')) {
      return {
        trimError: { value: 'control has leading whitespace' },
      };
    }
    if (control?.value?.endsWith(' ')) {
      return {
        trimError: { value: 'control has trailing whitespace' },
      };
    }
    return null;
  }
};

export const CountriesPhoneNumberFormat = {
  USA: /^\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
  Canada: /^\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
  UK: /^\+44 [0-9]{4} [0-9]{6}$/,
  France: /^\+33 [0-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/,
  Lebanon: /^\+961 [0-9]{1,2} [0-9]{3} [0-9]{3}$/,
};

export const TaskStatusConstants = {
  Completed: 'Completed',
  Failed: 'Failed',
  InProgress: 'InProgress',
  Pending: 'Pending',
};

export const ShipmentStatusConstants = {
  Delivered: 'Delivered',
  Failure: 'Failure',
  PreTransit: 'PreTransit',
  Returned: 'Returned',
  Shipped: 'Shipped',
  Transit: 'Transit',
  Unknown: 'Unknown',
};

export const ResourceTypeConstants = {
  Drawing: 'Drawing',
  Other: 'Other',
  PowerReport: 'PowerReport',
  Prewire: 'Prewire',
  Software: 'Software',
  SupplementalDocuments: 'SupplementalDocuments'
};

export const StorageConstants = {
  SessionExpired: 'SMR-SessionExpired',
  GetSessionStorage: 'SMR-GetSessionStorage',
  SessionStorage: 'SMR-SessionStorage',
  JwtToken: 'SMR-JwtToken',
  GENERATEFILE: 'SMR-GENERATEFILE',
  GENERATEFILE_VALUE: 'SMR-GENERATEFILE-VALUE',
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  PreventedUrl: 'PreventedUrl',
  PreviousUrl: 'PreviousUrl',
  IsPreventOnLogin: 'IsPreventOnLogin',
  IsPreventOnLogout: 'IsPreventOnLogout',
  SelectedAccount: 'SelectedAccount',
  AddBankAccountSelectedAccount: 'AddBankAccountSelectedAccount',
  AddBankAccountSelectedAccountName: 'AddBankAccountSelectedAccountName',
  CreateQuoteSelectedAccount: 'CreateQuoteSelectedAccount',
  CreateQuoteSelectedAccountName: 'CreateQuoteSelectedAccountName',
  StatementOfAccountSelectedAccount: 'StatementOfAccountSelectedAccount'
};

export const BankAccountStatusConstants = {
  AwaitingVerification: 'AwaitingVerification',
  Active: 'Active',
  ToBeDeleted: 'ToBeDeleted',
  TransferFailed: 'TransferFailed',
};

export const Regex = {
  DATE: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/,
  UTC_DATE: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,
};

export const FunctionConstants = {
  FormatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
  AssignDefaultValues(object: Object, _value: any) {
    if (!object || !(object instanceof Object)) {
      return;
    }

    if (object instanceof Array) {
      for (const item of object) {
        FunctionConstants.AssignDefaultValues(item, _value);
      }
    }

    for (const key of Object.keys(object)) {
      const value = object[key];

      if (value instanceof Array) {
        for (const item of value) {
          FunctionConstants.AssignDefaultValues(item, _value);
        }
      }

      if (value instanceof Object) {
        FunctionConstants.AssignDefaultValues(value, _value);
      }

      if (value === null || value === undefined) {
        object[key] = _value;
      }
    }
  },
  applyMask(e, mask) {
    e = e || window.event;

    const ignoredKeys = [
      'ArrowLeft',
      'ArrowRight',
      'Enter',
      'Insert',
      'Escape',
      'Backspace',
      'Delete',
      'Shift',
      'Ctrl',
      'Alt',
      'Break',
      'PageUp',
      'PageDown',
      'Tab',
      'CapsLock',
      'Clear',
      'Home',
      'End',
      'Execute',
      'PrintScreen'
    ];

    if (ignoredKeys.indexOf(e.key) > -1) {
      return;
    }

    //const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = e.key; //String.fromCharCode(charCode);

    //const charOfInput = charStr;
    const indexOfChar = e.target.value.length;

    if (indexOfChar < mask.length) {
      const charOfMask = mask[indexOfChar];
      if (charOfMask === 'a') {
        if (!this._isLetter(charStr)) {
          e.preventDefault();
          return false;
        }
      } else if (charOfMask === '9') {
        if (isNaN(+charStr) || charStr === ' ') {
          e.preventDefault();
          return false;
        }
      } else if (charOfMask !== charStr) {
        e.preventDefault();
        e.target.value = e.target.value + charOfMask;
        return false;
      }
    } else {
      e.preventDefault();
      return false;
    }
  }
};

export const CommonValues = {
  ShowAll: 'Show All',
  SharedReference: {}
};
