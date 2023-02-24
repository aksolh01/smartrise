import { Component, Input, OnInit } from '@angular/core';
import { Ng2TableCellComponent } from '../../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { ScreenBreakpoint } from '../../../../../../_shared/models/screenBreakpoint';
import { IShippingTrackingAction } from '../../../../../../_shared/models/shipping-tracking-action';
import { BaseComponentService } from '../../../../../../services/base-component.service';
import { ResponsiveService } from '../../../../../../services/responsive.service';
import { BaseComponent } from '../../../../../base.component';

@Component({
  selector: 'ngx-shipment-trackings',
  templateUrl: './shipment-trackings.component.html',
  styleUrls: ['./shipment-trackings.component.scss'],
})
export class ShipmentTrackingsComponent extends BaseComponent implements OnInit {
  @Input() trackings: IShippingTrackingAction[];

  isSmall: boolean = null;
  responsiveSubscription: any;

  settings = {
    mode: 'external',
    hideSubHeader: true,
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
      actionDateStr: {
        title: 'Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date');
        },
        valuePrepareFunction: this.formatUSDateTimeWithoutSeconds.bind(this),
        filter: false,
        sort: false,
      },
      address: {
        title: 'Address',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Address');
        },
        filter: false,
        sort: false
      },
      actionDescription: {
        title: 'Activity',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Activity');
        },
        filter: false,
        sort: false,
        width: '60%'
      },
    },
  };

  constructor(
    baseService: BaseComponentService,
    private responsiveService: ResponsiveService
    ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
}
}
