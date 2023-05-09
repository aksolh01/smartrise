import { Component, Input } from '@angular/core';
import { ShipmentStatusConstants } from '../../constants';
import { ShipmentStatus } from '../../models/shipment';

@Component({
  template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge text-white shipment-status-unknown" *ngIf="shipmentStatus === unknown">Unknown</div>
    <div class="badge text-white shipment-status-delivered" *ngIf="shipmentStatus === delivered">Delivered</div>
    <div class="badge text-white shipment-status-transit" *ngIf="shipmentStatus === transit">Transit</div>
    <div class="badge text-white shipment-status-failure" *ngIf="shipmentStatus === failure">Failure</div>
    <div class="badge text-white shipment-status-returned" *ngIf="shipmentStatus === returned">Returned</div>
    <div class="badge text-white shipment-status-pretransit" *ngIf="shipmentStatus === preTransit">PreTransit</div>
    <div class="badge text-white shipment-status-shipped" *ngIf="shipmentStatus === shipped">Shipped</div>
    <ng-template [ngIf]="shipmentStatus !== null" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="shipmentStatus === null">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class ShipmentStatusCellComponent {

  delivered = ShipmentStatusConstants.Delivered;
  failure = ShipmentStatusConstants.Failure;
  preTransit = ShipmentStatusConstants.PreTransit;
  returned = ShipmentStatusConstants.Returned;
  shipped = ShipmentStatusConstants.Shipped;
  transit = ShipmentStatusConstants.Transit;
  unknown = ShipmentStatusConstants.Unknown;

  shipmentStatus: string;
  @Input() set value(val: any) {
    this.shipmentStatus = val;
  }

  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  displayText(data: any) {
      return ShipmentStatus[data];
  }
}
