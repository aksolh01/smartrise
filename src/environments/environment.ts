/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  testing: false,
  paypalGatewayUrl: 'https://pilot-payflowlink.paypal.com',
  paypalProcessingFeesPercentage: 3.09,
  apiUrl: 'http://seportalapi.beytek.co/api/',
  socketApiUrl: 'wss://portaltestapi.smartrise.us/api/',
  toastMessageShowDuration: 5000,
  stripeKey: 'pk_test_51Kbp70AOD8pjxE7i8AuhyxhcSNJBwRwDJevj5miLdZTY0ZNt2XFiO9CaNGf3F01ixRfs5QnKVfEDkHVGDtEJf8iQ00m8tffmWE',
  recordsPerPage: 25
};
