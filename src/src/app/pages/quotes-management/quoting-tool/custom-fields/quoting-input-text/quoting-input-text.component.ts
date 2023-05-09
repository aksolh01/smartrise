import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingInputComponent } from '../quoting-input/quoting-input.component';

@Component({
  selector: 'ngx-quoting-input-text',
  templateUrl: './quoting-input-text.component.html',
  styleUrls: ['./quoting-input-text.component.scss']
})
export class QuotingInputTextComponent extends QuotingInputComponent implements OnInit {

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
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
  }

  onKeypress(event) {
  }
}
