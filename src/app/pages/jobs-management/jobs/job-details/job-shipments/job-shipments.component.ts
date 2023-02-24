import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InfoDialogComponent } from '../../../../../_shared/components/info-dialog/info-dialog.component';
import { IShipment } from '../../../../../_shared/models/shipment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JobTabService } from '../../../../../services/job-tabs.service';
import { InfoDialogData } from '../../../../../_shared/components/info-dialog/info-dialog-data';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-job-shipments',
  templateUrl: './job-shipments.component.html',
  styleUrls: ['./job-shipments.component.scss'],
})
export class JobShipmentsComponent implements OnInit, OnDestroy {
  @Input() shipments: IShipment[];
  selectedShipmentId: number | null;
  modelRef: any;

  constructor(private modalService: BsModalService,
    private jobTabService: JobTabService,
    private router: Router
  ) {
  }

  onClose() {
    this.router.navigateByUrl('pages/jobs-management/jobs');
  }

  ngOnDestroy(): void {
    if (this.modelRef !== null && this.modelRef !== undefined) {
this.modelRef.hide();
}
  }

  showPartsDescription(shippment: IShipment): void {
    const dialogData: InfoDialogData = {
      title: 'List of Parts',
      content: (shippment.partsDescription || '').split('\n'),
      dismissButtonLabel: 'Close',
      messageIfEmpty: 'No list of parts provided.',
      showAsBulltes: true,
      showDismissButton: true
    };
    this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: dialogData
    });
  }

  ngOnInit(): void {
    this.selectedShipmentId = +this.jobTabService.getExtraData();
  }

  onShipmentCollapsedExpanded(shipment, event) {
    shipment.trackingsExpanded = false;
  }

  onShipmentTrackingsCollapsedExpanded(shipment, event) {
    shipment.trackingsExpanded = !event;
  }
}
