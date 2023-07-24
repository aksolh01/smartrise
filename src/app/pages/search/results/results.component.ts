import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BaseComponentService } from '../../../services/base-component.service';
import { SearchService } from '../../../services/search.service';
import { Subscription } from 'rxjs';
import { MiscellaneousService } from '../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends BaseComponent implements OnInit, OnDestroy {

  searchKey: string = 'test';
  totalRecordsInAllResultSets: number = 0;
  jobsHasRecords: boolean;
  invoicesHasRecords: boolean;
  bankAccountsHasRecords: boolean;
  quotesCreatedByAccountHasRecords: boolean;
  quotesCreatedBySmartriseHasRecords: boolean;
  userActivitiesHasRecords: boolean;
  smartriseUsersHasRecords: boolean;
  accountUsersHasRecords: boolean;
  shipmentsHasRecords: boolean;
  jobFilesHasRecords: boolean;
  accountsHasRecords: boolean;
  companyInfoHasRecords: boolean;
  customerUsersHasRecords: boolean;
  statementOfAccountHasRecords: boolean;
  resultSets: number = 0;
  isLoading: boolean = true;
  resultSetReadySubscription: Subscription;
  isSmartriseUser: boolean;
  isCustomerUser: boolean;

  constructor(
    private route: ActivatedRoute,
    baseComponentService: BaseComponentService,
    private miscellaneousService: MiscellaneousService,
    private searchService: SearchService,
  ) {
    super(baseComponentService);
  }

  ngOnDestroy(): void {
    this.resultSetReadySubscription?.unsubscribe();
    this.searchService.clearSearch();
  }

  ngOnInit(): void {
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.isCustomerUser = this.miscellaneousService.isCustomerUser();
    this.route.queryParams.subscribe(pv => {
      this.isLoading = true;
      this.searchKey = pv.search;
      this.totalRecordsInAllResultSets = 0;
      this.resultSets = 0;
    });
    this.resultSetReadySubscription = this.searchService.resultSetReady$.subscribe(param => {
      this.totalRecordsInAllResultSets += param.recordsCount;
      this.resultSets++;
      if (param.resultSet === 'BankAccounts') {
        this.bankAccountsHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'Invoices') {
        this.invoicesHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'Jobs') {
        this.jobsHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'QuotesCreatedByAccount') {
        this.quotesCreatedByAccountHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'QuotesCreatedBySmartrise') {
        this.quotesCreatedBySmartriseHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'UserActivities') {
        this.userActivitiesHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'SmartriseUsers') {
        this.smartriseUsersHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'StatementOfAccounts') {
        this.statementOfAccountHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'AccountUsers') {
        this.accountUsersHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'Shipments') {
        this.shipmentsHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'JobFiles') {
        this.jobFilesHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'Accounts') {
        this.accountsHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'CustomerUsers') {
        this.customerUsersHasRecords = param.recordsCount > 0;
      }
      if (param.resultSet === 'CompanyInfo') {
        this.companyInfoHasRecords = param.recordsCount > 0;
      }
      this.isLoading = this.resultSets < (this.isSmartriseUser ? 11 : 11);
    });
  }
}
