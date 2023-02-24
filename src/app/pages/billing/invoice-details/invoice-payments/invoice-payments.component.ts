import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { NumberTableCellComponent } from '../../../../_shared/components/number-table-cell/number-table-cell.component';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BaseComponent } from '../../../base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-invoice-payments',
  templateUrl: './invoice-payments.component.html',
  styleUrls: ['./invoice-payments.component.scss']
})
export class InvoicePaymentsComponent extends BaseComponent implements OnInit {
  hasStripePayments: boolean;
  hasPaypalPayments: boolean;
  prevUrl: string;

  @Input() set stripePayments(_payments: any[]) {
    this.hasStripePayments = _payments.length > 0;
    this.stripeSource = new LocalDataSource(_payments);
  }

  @Input() set paypalPayments(_payments: any[]) {
    this.hasPaypalPayments = _payments.length > 0;
    this.paypalSource = new LocalDataSource(_payments);
  }

  paypalSettings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      paymentNetworkReference: {
        title: 'PN Reference',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('PN Reference');
        },
        filter: false,
        sort: false,
      },
      paymentAmount: {
        title: 'Payment Amount',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setHeader('Payment Amount');
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
        },
        filter: false,
        sort: false,
      },
      paymentMethod: {
        title: 'Payment Method',
        type: 'custom',
        valuePrepareFunction: (value) => value.match(/[A-Z][a-z]+/g).join(' ').trim(),
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Method');
        },
        filter: false,
        sort: false,
      },
      creditCardLastDigits: {
        title: 'Card Number (Last 4 Digits)',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Card Number (Last 4 Digits)');
        },
        filter: false,
        sort: false,
      },
      paymentStatus: {
        title: 'Payment Status',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: false,
        sort: false,
      },
      paymentDate: {
        title: 'Payment Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Date/Time');
        },
        valuePrepareFunction: this.formatUSDateTime.bind(this),
        filter: false,
        sort: false,
      },
      message: {
        title: 'Message',
        type: 'custom',
        width: '30%',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Message');
        },
        filter: false,
        sort: false,
      },
    },
  };

  stripeSettings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      page: 1,
      perPage: 5
    },
    columns: {
      paymentNetworkReference: {
        title: 'PN Reference',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('PN Reference');
        },
        filter: false,
        sort: false,
      },
      paymentAmount: {
        title: 'Payment Amount',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setHeader('Payment Amount');
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
        },
        filter: false,
        sort: false,
      },
      paymentMethod: {
        title: 'Payment Method',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Method');
        },
        filter: false,
        sort: false,
      },
      last4: {
        title: 'Account Number (Last 4 Digits)',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account Number (last 4 digits)');
        },
        filter: false,
        sort: false,
      },
      paymentStatus: {
        title: 'Payment Status',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: false,
        sort: false,
      },
      paymentDate: {
        title: 'Payment Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Date/Time');
        },
        valuePrepareFunction: this.formatUSDateTime.bind(this),
        filter: false,
        sort: false,
      },
      message: {
        title: 'Message',
        type: 'custom',
        width: '30%',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Message');
        },
        filter: false,
        sort: false,
      },
    },
  };

  paypalSource: LocalDataSource;
  stripeSource: LocalDataSource;

  constructor(baseComponentService: BaseComponentService,private router: Router) {
    super(baseComponentService);
  }

  ngOnInit(): void {
    this.prevUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
  }

  onClose() {
    this.router.navigateByUrl(this.prevUrl);
  }
}
