import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';
import { SelectHelperService } from '../../../services/select-helper.service';

@Component({
  template: `
  <nb-select
  (click)="onClick()"
  scrollStrategy="close"
  [fullWidth]="true"
  [formControl]="inputControl" [placeholder]="selectText"
  ngxSelectAutoWidth>
    <nb-option value="">{{ selectText }}</nb-option>
    <nb-option *ngFor="let option of optionsList" [value]="option.value">
      {{ option.title }}
    </nb-option>
</nb-select>
  `,
  styles: [
    `nb-select {
      width: 100%;
    }
    `
  ]
})
export class CpListFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy {

  inputControl = new UntypedFormControl();
  canFilter = true;
  isFirstTime = true;
  optionsList: any[];
  selectText: string;
  source: BaseServerDataSource;

  private readonly _unsubscribeAll = new Subject<void>();
  private isReset: boolean | null = null;

  constructor(private selectHelperService: SelectHelperService) {
    super();
    this._unsubscribeAll = new Subject<void>();
  }

  ngOnInit() {

    this.delay = 200;
    this.source.reset$
      .pipe(
        takeUntil(this._unsubscribeAll)
      ).subscribe(() => {
        if (this.inputControl.value != null) {
          this.isReset = true;
          this.inputControl.setValue(null);
      }
      });

    // this.filter.asObservable()
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     distinctUntilChanged(),
    //     debounceTime(this.delay)
    //   )
    //   .subscribe((val) => {
    //     console.info('Filter Val: ', val);
    //   });
    // fromEvent<KeyboardEvent>(this.inputRef.nativeElement, 'keyup')
    this._initConfig();
    this.inputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: string) => {
        if (!this.isReset) {
          this.source.setPage(1, false);
          this.filter.emit(value);
        } else {
          this.isReset = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.query) {
    //   this.query = changes.query.currentValue;
    //   this.inputControl.setValue(this.query, {emitEvent: false});
    // }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onClick() {
    this.selectHelperService.allowOnScroll.next(false);
  }

  // ngOnInit() {
  //   this._initConfig();
  //   this.inputControl.valueChanges
  //     .pipe(
  //       distinctUntilChanged(),
  //       debounceTime(this.delay),
  //     )
  //     .subscribe((value: any) => {
  //       this.query = value !== null ? this.inputControl.value.toString() : '';
  //       if (this.query !== "" || this.canFilter) {
  //         const ds = this.table.source as LocalDataSource;
  //         ds.setPage(1, false);
  //         this.setFilter();
  //       }
  //       this.canFilter = true;
  //     });
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.query) {
  //     this.query = changes.query.currentValue;
  //     this.canFilter = !(this.query === '');
  //     if (this.isFirstTime)
  //       this.canFilter = true;
  //     this.isFirstTime = false;
  //     if (this.query === '')
  //       this.inputControl.setValue(this.query);
  //   }
  // }

  private _initConfig(): void {
    this.selectText = this.column.getFilterConfig().selectText;
    this.optionsList = (this.column.getFilterConfig().list || []).sort();
  }
}
