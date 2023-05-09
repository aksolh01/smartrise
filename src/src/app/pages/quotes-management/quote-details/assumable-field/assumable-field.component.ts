import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-assumable-field',
  templateUrl: './assumable-field.component.html',
  styleUrls: ['./assumable-field.component.scss']
})
export class AssumableFieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() disableAssume = false;
  @Input() value: any;
  @Input() assumed: boolean;

  get valueIsNumber(): boolean {
    if (this.value === '' || this.value === undefined || this.value === null) {
      return true;
    }

    if (!isNaN(this.value)) {
      return true;
    }
    return false;
  }
}
