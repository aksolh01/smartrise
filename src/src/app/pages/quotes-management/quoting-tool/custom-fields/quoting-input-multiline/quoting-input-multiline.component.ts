import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { QuotingInputBaseComponent } from '../quoting-input-base/quoting-input-base.component';

@Component({
  selector: 'ngx-quoting-input-multiline',
  templateUrl: './quoting-input-multiline.component.html',
  styleUrls: ['./quoting-input-multiline.component.scss']
})
export class QuotingInputMultilineComponent extends QuotingInputBaseComponent implements OnInit {

  constructor(quotingToolService: QuotingToolValidationService, cd: ChangeDetectorRef) {
    super(quotingToolService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
