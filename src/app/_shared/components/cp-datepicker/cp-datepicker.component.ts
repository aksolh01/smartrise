import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'ngx-cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss']
})
export class CpDatepickerComponent {
  @Output() selectedDateChange = new EventEmitter();
  @Output() memberNameChange = new EventEmitter();
  @Output() inputModelChange = new EventEmitter<Date>();

  @ViewChild('input') input: ElementRef;
  @Input() inputModel: string;
  @Input() displayPlaceholder: string;
  memberNameValue: string;
  inputValue: string;

  private selectedDateValue?: Date;

  public get selectedDate(): Date | null {
    return this.selectedDateValue;
  }

  @Input()
  public set selectedDate(date: Date | null) {
    this.selectedDateValue = date;

    // if (date && this.input) {
    //   this.input.nativeElement.value = null;
    // }

    this.selectedDateChange.emit(date);
  }

  public get memberName(): string {
    return this.memberNameValue;
  }

  @Input()
  public set memberName(value: string) {
    this.memberNameValue = value;
    this.memberNameChange.emit(value);
  }

  onChangeModel(): void {
    let _date: Date | null;
    if (this.inputModel === '' || this.inputModel === null) {
_date = null;
} else {
_date = new Date(this.inputModel);
}
    this.inputModelChange.emit(_date);
  }

  onDateChanged(value: any): void {
    this.selectedDate = value;
  }

  clearDate(): void {
    this.selectedDate = null;
  }
}
