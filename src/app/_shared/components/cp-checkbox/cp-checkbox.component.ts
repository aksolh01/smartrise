import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-cp-checkbox',
  templateUrl: './cp-checkbox.component.html',
  styleUrls: ['./cp-checkbox.component.scss']
})
export class CpCheckboxComponent implements OnInit {

  @Output() checkStatusChange = new EventEmitter<boolean | null>();
  nullIsVisible = true;
  isDisabled = false;
  @Input() label: string;

  _checkStatus?: boolean = false;
  @Input() public get checkStatus(): boolean | null {
    return this._checkStatus;
  }

  public set checkStatus(value: boolean | null) {
    if (value === null) {
      this.nullIsVisible = true;
    } else {
      this.nullIsVisible = false;
    }

    this._checkStatus = value;
    this.checkStatusChange.emit(this._checkStatus);
  }

  _disable?: boolean = false;
  public set disable(value: boolean) {
    this._disable = value;
  }

  @Input() public get disable(): boolean {
    return this._disable;
  }


  constructor() { }

  ngOnInit(): void {
  }

  onOffCheckBoxChanged(event) {
    this.updateCheckings();
  }

  nullCheckBoxChanged(event) {
    this.updateCheckings();
  }

  updateCheckings() {
    if (this.checkStatus === null) {
      this.checkStatus = false;
      this.nullIsVisible = false;
    } else if (this.checkStatus) {
      this.checkStatus = null;
      this.nullIsVisible = true;
    } else if (!this.checkStatus) {
      this.checkStatus = true;
      this.nullIsVisible = false;
    }

    this.checkStatusChange.emit(this._checkStatus);
  }
}
