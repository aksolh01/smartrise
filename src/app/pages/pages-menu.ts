import { NbMenuItem } from '@nebular/theme';
import { URLs, PERMISSIONS } from '../_shared/constants';


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    link: '/pages/dashboard',
    home: true
  },
  {
    title: 'Jobs & Tracking',
    icon: 'options-outline',
    children: [
      {
        title: 'Jobs',
        link: URLs.JobsURL,
        data: PERMISSIONS.JobsListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Shipments',
        link: URLs.TrackingURL,
        data: PERMISSIONS.TrackingListing,
      },
      {
        title: 'Job Files',
        link: URLs.ViewResourcesURL,
        data: PERMISSIONS.ViewResourcesList,
      },
      {
        title: 'Invoices',
        link: URLs.ViewInvoicesURL,
        data: PERMISSIONS.ViewInvoicesList,
      },
    ],
  },
  {
    title: 'Open Quotes',
    icon: 'code-outline',
    link: URLs.ViewOpenQuotesURL,
    data: PERMISSIONS.OpenQuotesListing,
    pathMatch: 'prefix'
  },
  {
    title: 'Create A Quote',
    icon: 'file-add-outline',
    link: URLs.CreateOnlineQuote,
    data: PERMISSIONS.SaveOnlineQuote
  },
  {
    title: 'Billing',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Statement Of Account',
        link: URLs.ViewStatementOfAccountURL,
        data: PERMISSIONS.StatementOfAccount,
        pathMatch: 'prefix'
      },
      {
        title: 'Invoices',
        link: URLs.ViewBillingInvoicesURL,
        data: PERMISSIONS.InvoicesListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Bank Accounts',
        link: URLs.ViewBankAccountsURL,
        data: PERMISSIONS.ManageBankAccounts,
        pathMatch: 'prefix'
      },
    ],
  },
  {
    title: 'Accounts',
    icon: 'people',
    link: URLs.ViewCustomersURL,
    data: PERMISSIONS.CustomerListing,
    pathMatch: 'prefix'
  },
  {
    title: 'Account Users',
    icon: 'people-outline',
    link: URLs.ViewAccountUsersURL,
    data: PERMISSIONS.AccountUsersListing,
    pathMatch: 'prefix'
  },
  {
    title: 'Settings',
    icon: 'settings',
    pathMatch: 'prefix',
    children: [
      {
        title: 'Business Settings',
        link: URLs.BusinessSettingsURL,
        data: PERMISSIONS.BusinessSettingsDisplay,
      },
      {
        title: 'System Settings',
        link: URLs.SystemSettingsURL,
        data: PERMISSIONS.SystemSettingsDisplay,
      },
      {
        title: 'Manage Smartrise Users',
        link: URLs.SmartriseUsersURL,
        data: PERMISSIONS.SmartriseUsersListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Account Users',
        link: URLs.CustomerUsersURL,
        data: PERMISSIONS.CustomerUsersListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Company Info',
        link: URLs.CompanyInfoURL,
        data: PERMISSIONS.CompanyInfoDisplay,
      },
    ],
  },
  {
    title: 'User Activity',
    icon: 'alert-circle-outline',
    children: [
      {
        title: 'View User Activities',
        link: URLs.ViewUserActivities,
        data: PERMISSIONS.UserActivitiesListing,
        pathMatch: 'full'
      },
    ],
  },
  {
    title: 'Predictive Maintenance',
    icon: 'settings-2-outline',
    children: [
      {
        title: 'Dashboard',
        link: URLs.ViewPMDashboardURL,
        data: PERMISSIONS.JobsListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Jobs',
        link: URLs.ViewPMJobsURL,
        data: PERMISSIONS.JobsListing,
        pathMatch: 'prefix'
      },
      // {
      //   title: 'Parts',
      //   link: URLs.ViewPMPartsURL,
      //   data: PERMISSIONS.JobsListing,
      //   pathMatch: 'prefix'
      // },
      // {
      //   title: 'Alerts',
      //   link: URLs.ViewPMAlertsURL,
      //   data: PERMISSIONS.JobsListing,
      //   pathMatch: 'prefix'
      // },
      {
        title: 'Alert Settings',
        link: URLs.ViewPMAlertSettingsURL,
        data: PERMISSIONS.JobsListing,
        pathMatch: 'prefix'
      },
      {
        title: 'Notification Settings',
        link: URLs.ViewPMNotificationSettingsURL,
        data: PERMISSIONS.JobsListing,
        pathMatch: 'prefix'
      },
    ],
  },
  {
    title: 'Manuals & Resources',
    icon: 'file',
    url: 'https://www.smartrise.us/manuals-and-resources/',
    target: '_blank',
    link: '',
  },
];
