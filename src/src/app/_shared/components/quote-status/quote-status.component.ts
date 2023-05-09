import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-quote-status',
  templateUrl: './quote-status.component.html',
  styleUrls: ['./quote-status.component.scss']
})
export class QuoteStatusComponent implements OnInit {

  constructor() { }

  saved = 'Saved';
  generated = 'Generated';
  created = 'Created';

  quoteStatus: string;
  @Input() set value(val: any) {
    this.quoteStatus = val;
  }

  ngOnInit(): void {
  }

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

}
