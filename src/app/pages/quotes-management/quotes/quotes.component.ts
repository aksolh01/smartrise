import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenQuotesComponent } from '../open-quotes/open-quotes.component';
import { QuotingToolListComponent } from '../quoting-tool-list/quoting-tool-list.component';

@Component({
  selector: 'ngx-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  customerActiveTab = false;
  smartriseActiveTab = false;
  selectedTab: Observable<string>;

  @ViewChild('smartriseQuotes') smartriseQuotes: OpenQuotesComponent;
  @ViewChild('customerQuotes') customerQuotes: QuotingToolListComponent;

  constructor(
    private route: ActivatedRoute) {
    this.selectedTab = history?.state?.tab;
  }

  ngOnInit(): void {
    this._setActiveTab();
  }

  private _setActiveTab() {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    
    if (tab === null) {
      this.customerActiveTab = true;
      this.smartriseActiveTab = false;
      this.customerQuotes?.triggerGuidingTour();
    } else {
      this.customerActiveTab = false;
      this.smartriseActiveTab = true;
      this.smartriseQuotes?.triggerGuidingTour();
    }
  }

  onChangeTab($event) {
    if ($event.tabTitle === 'Created By Smartrise Sales') {
      this.smartriseQuotes?.triggerGuidingTour();
      this.smartriseQuotes?.onSearch();
    } else if ($event.tabTitle === 'Created By Account') {
      this.customerQuotes?.triggerGuidingTour();
      this.customerQuotes?.onSearch();
    }
  }
}
