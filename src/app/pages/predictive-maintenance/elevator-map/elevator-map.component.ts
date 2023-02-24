import { Component, OnInit } from '@angular/core';
import { IElevatorMapAreaDetails } from '../../../_shared/models/elevatorMapDetails';

@Component({
  selector: 'ngx-elevator-map',
  templateUrl: './elevator-map.component.html',
  styleUrls: ['./elevator-map.component.scss']
})
export class ElevatorMapComponent implements OnInit {

  partsDetailsClass: string;
  showPanel: boolean;
  details: IElevatorMapAreaDetails = { title: '', parts: [] };

  constructor() { }

  ngOnInit(): void {

  }

  openModel(className) {
    this.showPanel = true;
    this.partsDetailsClass = className + '-panel';

    if (className === 'car-top') {
      this.details.title = 'Car Top';
      this.details.parts = [
        { name: 'Inspection', criticalCount: 2, highCount: 1, mediumCount: 4, lowCount: 6 },
        { name: 'Door Operator', criticalCount: 0, highCount: 1, mediumCount: 2, lowCount: 3 },
      ];
    } else if (className === 'car-operation-panel') {
      this.details.title = 'Car Operational Panel';
      this.details.parts = [
        { name: 'PI (SRCE Board)', criticalCount: 1, highCount: 2, mediumCount: 0, lowCount: 0 },
      ];
    } else if (className === 'machine-room') {
      this.details.title = 'Machine Room';
      this.details.parts = [
        { name: 'L1', criticalCount: 3, highCount: 1, mediumCount: 0, lowCount: 0 },
        { name: 'L2 Breaker', criticalCount: 1, highCount: 1, mediumCount: 2, lowCount: 1 },
        { name: 'Soft Starter', criticalCount: 0, highCount: 3, mediumCount: 0, lowCount: 0 },
      ];
    }
  }

  closeModel() {
    this.showPanel = false;
  }

  onClickAnyware() {
    this.showPanel = false;
  }
}
