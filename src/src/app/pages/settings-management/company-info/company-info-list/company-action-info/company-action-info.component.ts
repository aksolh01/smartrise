import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { BaseComponent } from '../../../../base.component';

@Component({
  selector: 'ngx-company-action-info',
  templateUrl: './company-action-info.component.html',
  styleUrls: ['./company-action-info.component.scss']
})
export class CompanyActionInfoComponent extends BaseComponent implements OnInit {
  
  rowData: any;
  showDetails = new EventEmitter<any>();

  constructor(
    baseService: BaseComponentService) {
    super(baseService);
  }

  ngOnInit(): void {
  }

  onShowDetails() {
    this.showDetails.emit(this.rowData.id);
  }
}
