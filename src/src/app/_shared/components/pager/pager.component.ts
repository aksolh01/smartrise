import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  @Output() fetchingPage = new EventEmitter<number>();
  prevDisabled = false;
  nextDisabled = false;
  pagerArray = [];
  currentPageIndex = 0;
  @Input() pagerPages: number;
  @Input() pagesCount: number;
  constructor() { }

  ngOnInit(): void {
    this.fetchPage(1);
  }

  updatePager() {

    if (this.pagerArray.length === 0) {
      for (let index = 1; index <= this.pagerPages; index++) {
        this.pagerArray.push(index);
      }
      return;
    }

    const firstPageIndex = this.pagerArray[0];
    const lastPageIndex = this.pagerArray[this.pagerArray.length - 1];

    const position = this.pagerArray.indexOf(this.currentPageIndex);
    if (position === -1) {
      if (this.currentPageIndex < firstPageIndex) {
        for (let index = 0; index < this.pagerArray.length; index++) {
          this.pagerArray[index] = this.pagerArray[index] - 1;
        }
      } else if (this.currentPageIndex > lastPageIndex) {
        for (let index = 0; index < this.pagerArray.length; index++) {
          this.pagerArray[index] = this.pagerArray[index] + 1;
        }
      }
    }

    this.prevDisabled = this.pagerArray[0] === 1 || this.pagesCount < this.pagerPages;
    this.nextDisabled = this.pagerArray[this.pagerArray.length - 1] === this.pagesCount || this.pagesCount < this.pagerPages;
  }

  fetchPage(pageIndex: number) {
    this.currentPageIndex = pageIndex;
    this.fetchingPage.emit(pageIndex);
  }

  fetchNextPage() {
    this.fetchPage(this.currentPageIndex + 1);
  }

  displayNextPagerPages() {
    const lastPagerIndex = this.pagerArray[this.pagerArray.length - 1];
    if (lastPagerIndex + this.pagerPages > this.pagesCount) {
      let index = this.pagerPages - 1;
      for (let pagerIndex = this.pagesCount; pagerIndex > (this.pagesCount - this.pagerPages); pagerIndex--) {
        this.pagerArray[index] = pagerIndex;
        index--;
      }
    } else {
      for (let index = 0; index < this.pagerArray.length; index++) {
        this.pagerArray[index] = this.pagerArray[index] + this.pagerPages;
      }
    }
    this.fetchPage(this.pagerArray[this.pagerArray.length - 1]);
  }

  fetchPreviousPage() {
    this.fetchPage(this.currentPageIndex - 1);
  }

  displayPreviousPagerPages() {
    const firstPagerIndex = this.pagerArray[0];
    if (firstPagerIndex - this.pagerPages < 1) {
      for (let index = 1; index <= this.pagerPages; index++) {
        this.pagerArray[index - 1] = index;
      }
    } else {
      for (let index = 0; index < this.pagerArray.length; index++) {
        this.pagerArray[index] = this.pagerArray[index] - this.pagerPages;
      }
    }
    this.fetchPage(this.pagerArray[0]);
  }
}
