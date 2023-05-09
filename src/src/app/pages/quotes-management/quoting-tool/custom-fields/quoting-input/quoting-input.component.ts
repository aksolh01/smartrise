import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { allowDecimal, allowInteger } from '../../../../../_shared/functions';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-input',
  templateUrl: './quoting-input.component.html',
  styleUrls: ['./quoting-input.component.scss']
})
export class QuotingInputComponent extends QuotingInputBaseComponent implements OnInit {

  @Input() length = 255;
  @Input() type: string;
  focus = new EventEmitter<any>();

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onFocus(event) {
    this.blink = false;
    this.focus.next(event);
  }

  onKeyUp(event) {
    if (this._oldValue !== this.item[this.valueField]) {
      this.unAssume();
      this.validateValue(this.item[this.valueField]);
      this.notifySort();
      this._oldValue = this.item[this.valueField];
    }
  }
}
