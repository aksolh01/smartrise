import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-map-severity',
  templateUrl: './map-severity.component.html',
  styleUrls: ['./map-severity.component.scss']
})
export class MapSeverityComponent implements OnInit {

  isNumber = true;
  severityMapped = new EventEmitter<any>();

  partType: any;
  number: any;
  severity: any;
  thresholdType: any;
  period: any;
  periodUnit: any;

  constructor(
    private readonly modalRef: BsModalRef<MapSeverityComponent>,
  ) { }

  ngOnInit(): void {
  }

  onChange(event) {
    if (event.target.value === 'Number') {
      this.isNumber = true;
    } else {
      this.isNumber = false;
    }
  }

  onClose() {
    this.modalRef.hide();
  }

  onSave() {
    this.severityMapped.emit({
      partType: this.partType,
      severityType: this.severity,
      thresholdType: this.thresholdType,
      number: this.number,
      period: this.period,
      periodUnit: this.periodUnit,
    });
  }

  onChangeSeverity(event) {
    if (event.target.value === 'Fault') {
    }
  }
}
