import { EventEmitter, Injectable } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { BaseParams } from '../models/baseParams';
import { SortDirection } from '../models/enums';
import { IPagination } from '../models/pagination';

@Injectable()
export class BaseServerDataSource extends LocalDataSource {

  public pagination: IPagination;
  private localRefreshMode = false;
  private readonly params: BaseParams;
  private readonly _resetSubject: Subject<void>;
  private readonly _cleanSubject: Subject<void>;
  readonly reset$: Observable<void>;
  readonly clean$: Observable<void>;
  private pipes: OperatorFunction<IPagination, IPagination>[] = [];

  serviceCallBack: (params: BaseParams) => Observable<IPagination>;
  serviceErrorCallBack: (error: any) => void = (error) => {};
  convertFilterValue: (key: string, value: string) => any;

  dataLoading = new EventEmitter<any>();
  lastRequestCount = 0;
  defaultSort: string;

  constructor(data?: any[]) {
    super(data);
    this._resetSubject = new Subject<void>();
    this._cleanSubject = new Subject<void>();

    this.reset$ = this._resetSubject.asObservable();
    this.clean$ = this._cleanSubject.asObservable();

    this.params = new BaseParams();
  }

  // override
  getElements(): Promise<any> {
    this.dataLoading.emit(true);

    this._clearParams();

    this._setFilterParam();
    this._setSortParam();
    this._setPagingParam();

    return this._getData();
  }

  // override
  count(): number {
    return this.lastRequestCount;
  }

  refreshAndGoToFirstPage() {
    this.setPage(1, false);
    this.refresh();
  }

  resetFilters(): void {
    if (this.filterConf && this.filterConf.filters && this.filterConf.filters.length) {
      this.setFilter([]);
      this.notifyReset();
    } else {
      this._cleanSubject.next();
    }
  }

  hasFilter(): boolean {
    if (this.filterConf && this.filterConf.filters && this.filterConf.filters.length) {
      return true;
    }
    return false;
  }

  updateRecord(record: any, newRecord: any) {
    this.localRefreshMode = true;
    const indexOfRecord = this.pagination.data.indexOf(record);
    this.pagination.data[indexOfRecord] = newRecord;
    this.refresh();
  }

  removeRecord(record: any) {
    this.localRefreshMode = true;
    const indexOfRecord = this.pagination.data.indexOf(record);
    this.pagination.data.splice(indexOfRecord, 1);
    this.refresh();
  }

  injectPipe(pipe: OperatorFunction<IPagination, IPagination>) {
    this.pipes.push(pipe);
  }

  applyLocalFilter(filterCallback) {
    this.localRefreshMode = true;
    this.pagination.data = this.pagination.data.filter(filterCallback);
    this.refresh();
  }

  notifyReset() {
    this._resetSubject.next();
  }

  private _getData(): Promise<any> {
    if (this.localRefreshMode) {
      this.localRefreshMode = false;
      return this._result(of(this.pagination));
    } else {
      return this._result(
        this._implementPipes(
          this.serviceCallBack(this.params)
        ).pipe(catchError(err => {
          if (err) {
            if (err.status !== 401) {
              this.serviceErrorCallBack(err);
            }
          }
          this.dataLoading.emit(false);
          return of({
            pageIndex: 0,
            pageSize: 0,
            data: [],
            count: 0,
          });
        }))
      );
    }
  }

  private _implementPipes(input: Observable<IPagination>): Observable<IPagination> {
    let output = input;
    this.pipes.forEach(p => {
      output = output.pipe(p);
    });
    return output;
  }

  private _toSortDirection(sortConfig: any): SortDirection | null {
    if (sortConfig.direction === 'asc') {
return SortDirection.Asc;
}
    if (sortConfig.direction === 'desc') {
return SortDirection.Desc;
}
    return null;
  }

  private _result(para: Observable<IPagination>): Promise<any> {
    return para.pipe(map(this._transfer.bind(this))).toPromise();
  }

  private _transfer(pagination: IPagination) {
    this.pagination = pagination;
    this.lastRequestCount = pagination.count;
    this.dataLoading.emit(false);
    return pagination.data;
  }

  private _setSortParam(): void {
    if (this.sortConf && this.sortConf.length) {
      this.params.sort = this.sortConf[0].field;
      this.params.sortDirection = this._toSortDirection(this.sortConf[0]);
    }
  }

  private _setFilterParam(): void {
    if (this.filterConf.filters && this.filterConf.filters.length) {
      this.filterConf.filters.forEach((fieldConf) => {
        const field = fieldConf['field'];
        if (this.convertFilterValue != null) {
this.params[field] = this.convertFilterValue(field, fieldConf['search']);
} else {
this.params[field] = fieldConf['search'];
}
      });
    }
  }

  private _setPagingParam(): void {
    this.params.pageSize = this.pagingConf['perPage'];
    this.params.pageIndex = this.pagingConf['page'];
  }

  private _clearParams(): void {
    Object.keys(this.params).forEach(key => {
      this.params[key] =
        (key === 'sort' ? 'createDate' : key === 'pageIndex' ? 1 : key === 'pageSize' ? 0 : null);
    }
    );
  }
}
