import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  @ViewChild('normal') normal: ElementRef;
  @ViewChild('offline') offline: ElementRef;
  @ViewChild('attentionNeeded') attentionNeeded: ElementRef;
  @ViewChild('atFault') atFault: ElementRef;

  @Output() legendClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickLegend(status) {
    if (status === 2) {

      if (!this.normal.nativeElement.classList.contains('disabled')) {
        this.normal.nativeElement.classList.add('disabled');
        this.legendClicked.emit({ name: status, remove: true });
      } else {
        this.normal.nativeElement.classList.remove('disabled');
        this.legendClicked.emit({ name: status, remove: false });
      }

    } else if (status === 1) {

      if (!this.attentionNeeded.nativeElement.classList.contains('disabled')) {
        this.attentionNeeded.nativeElement.classList.add('disabled');
        this.legendClicked.emit({ name: status, remove: true });
      } else {
        this.attentionNeeded.nativeElement.classList.remove('disabled');
        this.legendClicked.emit({ name: status, remove: false });
      }

    } else if (status === 3) {

      if (!this.offline.nativeElement.classList.contains('disabled')) {

        this.offline.nativeElement.classList.add('disabled');
        this.legendClicked.emit({ name: status, remove: true });

      } else {

        this.offline.nativeElement.classList.remove('disabled');
        this.legendClicked.emit({ name: status, remove: false });

      }

    } else if (status === 0) {

      if (!this.atFault.nativeElement.classList.contains('disabled')) {
        this.atFault.nativeElement.classList.add('disabled');
        this.legendClicked.emit({ name: status, remove: true });
      } else {
        this.atFault.nativeElement.classList.remove('disabled');
        this.legendClicked.emit({ name: status, remove: false });
      }

    }
  }

  onSpanMouseOver(element) {
    element.classLists.add('');
    console.log(element);
  }
}
