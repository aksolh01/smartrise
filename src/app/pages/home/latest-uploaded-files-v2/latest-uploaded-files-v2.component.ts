import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponentService } from '../../../services/base-component.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-latest-uploaded-files-v2',
  templateUrl: './latest-uploaded-files-v2.component.html',
  styleUrls: ['./latest-uploaded-files-v2.component.scss']
})
export class LatestUploadedFilesV2Component extends BaseComponent implements OnInit {

  @Input() displayCustomerName: boolean;
  @Input() isLoading = true;
  @Input() data: any[] = null;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  constructor(baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void { }

  onRefresh() {
    this.refresh.emit(null);
  }
}
