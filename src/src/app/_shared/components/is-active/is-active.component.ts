import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-is-active',
  templateUrl: './is-active.component.html',
  styleUrls: ['./is-active.component.scss']
})
export class IsActiveComponent implements OnInit {

  ngOnInit(): void {
  }

  isActive?: boolean = null;

  @Input() set value(val: any) {
    this.isActive = val === '' ? null : /true/i.test(val.toString());
  }

  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}
