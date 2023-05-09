import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent implements OnInit {

  change = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event) {
    this.change.next(event.target.checked);
  }

}
