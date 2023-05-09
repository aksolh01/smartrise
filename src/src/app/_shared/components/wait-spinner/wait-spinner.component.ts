import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-wait-spinner',
  templateUrl: './wait-spinner.component.html',
  styleUrls: ['./wait-spinner.component.scss']
})
export class WaitSpinnerComponent implements OnInit {

  @Input() scale: number;
  scaleStyle: string;
  constructor() { }

  ngOnInit(): void {
    this.scaleStyle = `transform: scale(${this.scale});`;
  }

}
