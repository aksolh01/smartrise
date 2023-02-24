import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingToolService } from '../../../../../services/quoting-tool.service';
import { FunctionConstants } from '../../../../../_shared/constants';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-date',
  templateUrl: './quoting-date.component.html',
  styleUrls: ['./quoting-date.component.scss']
})
export class QuotingDateComponent extends QuotingInputBaseComponent implements OnInit {

  @ViewChild('datepicker') datepicker: any;

  constructor(quotingToolService: QuotingToolValidationService,
    private datePipe: DatePipe, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onDateFocus(event) {
    if (!event.target.value) {
this.datepicker.value = new Date();
}
  }

  dateKeyPress(event) {
    FunctionConstants.applyMask(event, '99/99/9999');
  }

  formatUSDateTime(date: string) {
    if (date) {
      const raw = new Date(date);
      const formatted = this.datePipe.transform(raw, 'MM/dd/yyyy hh:mm:ss aa');
      return formatted;
    }
    return '';
  }

  valueChange(event) {
  }

  onDateChanged(event) {
    setTimeout(() => {
      this.validateValue(this.item[this.valueField]);
      this.notifySort();
      this._oldValue = this.item[this.valueField];
    });
    this.unAssume();
  }
}
