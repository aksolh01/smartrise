import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { allowDecimal, allowInteger } from '../../../../../_shared/functions';
import { QuotingInputComponent } from '../quoting-input/quoting-input.component';

@Component({
  selector: 'ngx-quoting-input-number',
  templateUrl: './quoting-input-number.component.html',
  styleUrls: ['./quoting-input-number.component.scss']
})
export class QuotingInputNumberComponent extends QuotingInputComponent implements OnInit {

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }


  ngOnInit(): void {
    super.ngOnInit();
  }

  @Input() decimals?: number;
  length = 8;

  onKeypress(event) {
    let result = false;
    if (+this.decimals === 0) {
      result = allowInteger(event);
    } else {
      result = allowDecimal(event, this.decimals);
    }
    if (!result) {
      event.preventDefault();
      return;
    }
  }

  processInput(event: ClipboardEvent) {

    const clipboardText = event.clipboardData.getData('text');
    let value = clipboardText;
    if (this.item[this.valueField]) {
      value = this.item[this.valueField].toString() + clipboardText;
    }

    if (value.length > this.length) {
      event.preventDefault();
      return;
    }

    let r: RegExp;
    if (this.decimals > 0) {
      r = new RegExp(`^[0-9]*(\\.)?[0-9]{1,${this.decimals}}$`);
    } else {
      r = new RegExp(`^[0-9]*$`);
    }
    if (!r.test(value)) {
      event.preventDefault();
      return;
    }
  }
}
