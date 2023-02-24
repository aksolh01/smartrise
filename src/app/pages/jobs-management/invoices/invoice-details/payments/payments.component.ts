import { Component, Input, OnInit } from '@angular/core';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { IPayment } from '../../../../../_shared/models/payment.model';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { BaseComponent } from '../../../../base.component';

@Component({
  selector: 'ngx-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent extends BaseComponent implements OnInit {

  @Input() payments: IPayment[];

  constructor(baseService: BaseComponentService) {
    super(baseService);
  }

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 20,
    },
    columns: {
      paymentAmount: {
        title: 'Amount',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Amount');
        },
        filter: false,
      },
      dueDate: {
        title: 'Due Date',
        type: 'custom',
        valuePrepareFunction: this.formatUSDate.bind(this),
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Due Date');
        },
        filter: false,
      },
      paymentDate: {
        title: 'Payment Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: this.formatUSDate.bind(this),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Payment Date');
        },
        filter: false,
      },
    }
  };

  ngOnInit(): void {
  }

}
