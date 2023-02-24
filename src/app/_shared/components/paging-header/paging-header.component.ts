import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() entitiesLabel: string;

  constructor() { }

  ngOnInit(): void {
  }

}
