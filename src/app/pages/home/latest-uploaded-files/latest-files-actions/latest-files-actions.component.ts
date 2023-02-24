import { Component, EventEmitter, OnInit } from '@angular/core';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-latest-files-actions',
  templateUrl: './latest-files-actions.component.html',
  styleUrls: ['./latest-files-actions.component.scss']
})
export class LatestFilesActionsComponent extends BaseComponent implements OnInit {

  viewDetails = new EventEmitter<any>();
  download = new EventEmitter<any>();
  rowData: any;

  constructor(baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void {
  }

  onDownload(rowData: any) {
    this.download.emit(rowData);
  }

  onViewDetails(rowData: any) {
    this.viewDetails.emit(rowData);
  }
}
