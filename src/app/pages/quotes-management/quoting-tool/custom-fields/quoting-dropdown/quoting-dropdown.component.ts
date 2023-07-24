import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { SelectHelperService } from '../../../../../services/select-helper.service';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-dropdown',
  templateUrl: './quoting-dropdown.component.html',
  styleUrls: ['./quoting-dropdown.component.scss']
})
export class QuotingDropdownComponent extends QuotingInputBaseComponent implements OnInit {

  @Output() dropdownopen = new EventEmitter<void>();

  @Input() dataSource: any[] = [];
  @Input() dataSourceDisplayField: string;
  @Input() dataSourceValueField: string;
  @Input() selectOptionLabel: string;
  @Input() selectOptionValue: string;

  constructor(quotingToolService: QuotingToolValidationService, private selectHelperService: SelectHelperService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onDDClick() {
    this.blink = false;
    this.dropdownopen.next();
    this.selectHelperService.allowOnScroll.next(false);
  }

  onSelectedChange(event) {
    setTimeout(() => {
      this.validateValue(this.item[this.valueField]);
      this.notifySort();
      this._oldValue = this.item[this.valueField];
    });
    this.unAssume();
    this.changed.next(event);
  }
}
