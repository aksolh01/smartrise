import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingToolService } from '../../../../../services/quoting-tool.service';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-input-autocomplete',
  templateUrl: './quoting-input-autocomplete.component.html',
  styleUrls: ['./quoting-input-autocomplete.component.scss']
})
export class QuotingInputAutocompleteComponent extends QuotingInputBaseComponent implements OnInit, AfterViewInit {

  @Input() autocompleteValueField: string;
  @Input() autocompleteDisplayField: string;
  @Input() initValue: string;
  @Input() options: any[];

  @Output() filter = new EventEmitter<string>();
  @Output() selected = new EventEmitter<any>();

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    if (this.initValue) {
this.i.nativeElement.value = this.initValue;
}
  }

  onKeyDown(event) {
    this.filter.next(event.target.value + event.key);
  }

  onSelectionChange(event) {
    this.selected.next(event);
    this.item[this.valueField] = event[this.autocompleteValueField];
    this.i.nativeElement.value = event[this.autocompleteDisplayField];
  }
}
