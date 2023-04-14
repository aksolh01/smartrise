import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CustomerService } from '../../../services/customer.service';
import { IAccountLookup } from '../../../_shared/models/customer-lookup';

@Component({
  selector: 'ngx-search-accounts-lookup',
  templateUrl: './search-accounts-lookup.component.html',
  styleUrls: ['./search-accounts-lookup.component.scss']
})
export class SearchAccountsLookupComponent implements OnInit {

  @Output() accountSelected = new EventEmitter<any>();
  debounceTimeSearchAccounts = new Subject<string>();
  @Input() delay: number = 200;
  filteredAccounts: IAccountLookup[] = [];
  @ViewChild('selectedAccountInput') selectedAccountInput: ElementRef<HTMLInputElement>;
  isFetchingAccounts: boolean;

  constructor(private customerService: CustomerService) {
    this.debounceTimeSearchAccounts.pipe(debounceTime(this.delay)).subscribe(val => this.onSearchAccounts(val));
  }

  onSearchAccounts(searchValue: string) {
    this.isFetchingAccounts = true;
    this.customerService.getCustomersPagedLookup(searchValue).subscribe(accounts => {
      this.isFetchingAccounts = false;
      this.filteredAccounts = accounts;
    });
  }

  onSelectionChange(item) {
    if (!item) {
      return;
    }
    this.selectedAccountInput.nativeElement.value = null;
    this.accountSelected.emit(item);
  }

  ngOnInit(): void {
  }

}
