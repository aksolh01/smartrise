import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-button',
  templateUrl: './ngx-button.component.html',
  styleUrls: ['./ngx-button.component.scss']
})
export class NgxButtonComponent implements OnInit, OnChanges {

  @Output() nClick = new EventEmitter<any>();
  @Input() class: string;
  @Input() type: any;
  @Input() isLoading = false;
  @Input() disabled = false;
  click: any;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.elRef.nativeElement.classList.remove(...this.elRef.nativeElement.classList);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'isLoading': {

          }
        }
      }
    }
  }

  onClick(event) {
    if (!this.disabled) {
this.nClick.emit(event);
}
  }
}
