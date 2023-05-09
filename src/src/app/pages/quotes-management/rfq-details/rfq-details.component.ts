import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../services/message.service';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { Ng2TableHtmlCellComponent } from '../../../_shared/components/ng2-table-html-cell/ng2-table-html-cell.component';
import { NumberTableCellComponent } from '../../../_shared/components/number-table-cell/number-table-cell.component';
import { ProgressStatusEnum } from '../../../_shared/models/download.models';

@Component({
  selector: 'ngx-rfq-details',
  templateUrl: './rfq-details.component.html',
  styleUrls: ['./rfq-details.component.scss']
})
export class RfqDetailsComponent implements OnInit, OnDestroy {

  isDownloading = false;
  isLoading = true;
  rfq: any;
  quoteName: string;
  totalPrice = 0;
  shippingHandling = 0;
  grandTotal = 0;
  source: LocalDataSource;
  settings: any = {
    pager: {
      display: true,
      page: 1,
      perPage: 10000
    },
    mode: 'external',
    filter: false,
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      product: {
        title: 'Product',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Product');
        },
        show: false,
        sort: false,
        filter: false,
      },
      description: {
        title: 'Description',
        type: 'custom',
        renderComponent: Ng2TableHtmlCellComponent,
        onComponentInitFunction: (instance: Ng2TableHtmlCellComponent) => {
          instance.setHeader('Description');
        },
        filter: false,
        sort: false,
      },
      unitPrice: {
        title: 'Unit Price',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
          instance.setHeader('Unit Price');
        },
        filter: false,
        sort: false,
      },
      quantity: {
        title: 'Quantity',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Quantity');
        },
        filter: false,
        sort: false,
      },
      totalPrice: {
        title: 'Total Price',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
          instance.setHeader('Total Price');
        },
        filter: false,
        sort: false,
      },
    },
  };
  quoteId: number;
  successSub: any;

  constructor(
    private quotingService: QuotingToolService,
    private messageService: MessageService,
    private ref: BsModalRef
  ) { }

  ngOnDestroy(): void {
    this.successSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.quotingService.getRfq(this.quoteId).subscribe(rfq => {
      this.isLoading = false;
      this.grandTotal = rfq?.totalPrice,
        this.totalPrice = rfq?.grandTotal,
        this.shippingHandling = rfq?.shippingHandling,
        this.data = rfq?.quoteLines,
        this.quoteName = rfq?.quoteName;
    }, error => {
      setTimeout(() => {
        this.ref.hide();
      });
    });
  }

  set data(d: any[]) {
    this.source = new LocalDataSource(d);
  }

  onCancel() {
    this.ref.hide();
  }

  onDownload() {

    if(this.isDownloading) {
      return;
    }

    this.isDownloading = true;
    this.quotingService.downloadRfqReport(this.quoteId, true).subscribe(s => {
      if (s.status === ProgressStatusEnum.COMPLETE) {
        this.isDownloading = false;
        this.messageService.showSuccessMessage(
          'File has been downloaded successfully'
        );
      } else if (s.status === ProgressStatusEnum.ERROR) {
        this.isDownloading = false;
      }
    }, error => {
      this.isDownloading = true;
    });
  }
}
