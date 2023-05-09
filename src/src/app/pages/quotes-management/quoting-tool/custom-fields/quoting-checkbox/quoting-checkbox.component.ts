import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingToolService } from '../../../../../services/quoting-tool.service';
import { ChangingEventArg } from '../../business/types';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-checkbox',
  templateUrl: './quoting-checkbox.component.html',
  styleUrls: ['./quoting-checkbox.component.scss']
})
export class QuotingCheckboxComponent extends QuotingInputBaseComponent implements OnInit {

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onCheckBoxChanged(event) {

    const arg: ChangingEventArg = {
      oldValue: !event,
      newValue: event,
      handled: false
    };

    if (!this._preconditionsPassed(arg)) {
      this._rollbackCheckStatus(event);
      return;
    }

    setTimeout(() => {
      this.validateValue(this.item[this.valueField]);
      this.notifySort();
      this.unAssume();
    });
  }

  private _preconditionsPassed(arg: ChangingEventArg) {
    for (const fn of this.preconditionCallbacks) {
      fn(this.item, arg);
      if (arg.handled) {
        return false;
      }
    }
    return true;
  }

  private _rollbackCheckStatus(event: any) {
    setTimeout(() => this.item[this.valueField] = !event);
  }
}
