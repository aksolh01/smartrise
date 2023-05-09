import { Component, Input, OnInit } from '@angular/core';
import { IElevatorMapAreaDetails } from '../../../../_shared/models/elevatorMapDetails';

@Component({
  selector: 'ngx-elevator-area-details',
  templateUrl: './elevator-area-details.component.html',
  styleUrls: ['./elevator-area-details.component.scss']
})
export class ElevatorAreaDetailsComponent implements OnInit {

  @Input() details: IElevatorMapAreaDetails;

  constructor() { }

  ngOnInit(): void {
  }
}
