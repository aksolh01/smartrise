import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit {

  @Input() title: string;
  @Input() count: number;
  @Input() changeCount: number;
  @Input() showGreenArrow: boolean | null;
  @Input() showRedArrow: boolean | null;

  constructor() { }

  ngOnInit(): void {
  }
}
