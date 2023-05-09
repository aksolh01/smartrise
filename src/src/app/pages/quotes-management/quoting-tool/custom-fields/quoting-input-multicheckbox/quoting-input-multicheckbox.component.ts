import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingToolService } from '../../../../../services/quoting-tool.service';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-input-multicheckbox',
  templateUrl: './quoting-input-multicheckbox.component.html',
  styleUrls: ['./quoting-input-multicheckbox.component.scss']
})
export class QuotingInputMulticheckboxComponent extends QuotingInputBaseComponent implements OnInit {

  @Input() dataSource: any[] = [];
  @Input() dataSourceDisplayField: string;
  @Input() dataSourceValueField: string;

  constructor(private qutingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(qutingToolService, cd);
  }

  ngOnInit(): void {
  }

  onCheckChange($event) {
  }
}
