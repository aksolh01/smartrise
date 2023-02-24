import { Component, EventEmitter, forwardRef, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { StatementOfAccountComponent } from '../statement-of-account.component';

@Component({
  selector: 'ngx-pay-filter',
  templateUrl: './pay-filter.component.html',
  styleUrls: ['./pay-filter.component.scss']
})
export class PayFilterComponent extends DefaultFilter implements OnInit, OnChanges {
  source: BaseServerDataSource;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(@Inject(forwardRef(() => StatementOfAccountComponent)) private _parent: StatementOfAccountComponent) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.source.reset$
      .pipe(
        takeUntil(this._unsubscribeAll)
      ).subscribe(() => {
        this.checkStatus = null;
      });
  }

  @Output() checkStatusChange = new EventEmitter<boolean | null>();
  nullIsVisible = true;

  _checkStatus?: boolean = false;
  @Input() public get checkStatus(): boolean | null {
    return this._checkStatus;
  }

  public set checkStatus(value: boolean | null) {
    if (value === null) {
      this.nullIsVisible = true;
    } else {
      this.nullIsVisible = false;
    }

    this._checkStatus = value;
    this._parent.onFilterPay(value);
    this.checkStatusChange.emit(this._checkStatus);
  }

  _disable?: boolean = false;
  public set disable(value: boolean) {
    this._disable = value;
  }

  @Input() public get disable(): boolean {
    return this._disable;
  }

  onOffCheckBoxChanged(event) {
    this.updateCheckings();
  }

  nullCheckBoxChanged(event) {
    this.updateCheckings();
  }

  updateCheckings() {
    if (this.checkStatus === null) {
      this.checkStatus = false;
      this.nullIsVisible = false;
    } else if (this.checkStatus) {
      this.checkStatus = null;
      this.nullIsVisible = true;
    } else if (!this.checkStatus) {
      this.checkStatus = true;
      this.nullIsVisible = false;
    }

    this.checkStatusChange.emit(this._checkStatus);
  }
}
