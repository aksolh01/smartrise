import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-searchable-contacts-list',
  templateUrl: './searchable-contacts-list.component.html',
  styleUrls: ['./searchable-contacts-list.component.scss']
})
export class SearchableContactsListComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput: any;

  hasOptions = false;
  isRefreshingContacts = false;
  title: string;
  search: string;
  initialValue: any;
  @Input() autocompleteValueField: string;
  @Input() autocompleteDisplayField: string;
  @Input() options: any[];
  displayOptions: any[];

  @Output() refresh = new EventEmitter<any>();

  selectedContact: any;

  constructor(private ref: BsModalRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  }

  ngOnInit(): void {
    this.displayOptions = this.options;
    this.hasOptions = this.displayOptions.length > 0;
  }

  onChange(event) {
    this.displayOptions = this.options.filter(x => x[this.autocompleteDisplayField].toLowerCase().indexOf((event.target?.value?.trim()).toLowerCase()) > -1);
    this.hasOptions = this.displayOptions.length > 0;
  }

  onSelectionChange(event) {
    this.selectedContact = event;
    this.ref.hide();
  }

  onCancel() {
    this.ref.hide();
  }
}
