import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DefaultFilter } from 'ng2-smart-table';
@Component({
    template: `
    <!--         <input
            [nbDatepicker]="datepicker"
            [formControl]="inputControl"
            type="text"
            [placeholder]="column.title"
            class="form-control">
<nb-date-timepicker withSeconds #datepicker></nb-date-timepicker> -->   `,
})

export class CpDateTimeFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy {
    inputControl = new UntypedFormControl();
    canFilter = true;
    isFirstTime = true;
    private readonly _unsubscribeAll;

    constructor() {
        super();

        // this.delay = 2000;
    }

    ngOnInit() {
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
        this.inputControl.valueChanges
          .pipe(
            takeUntil(this._unsubscribeAll),
            // map(m => (<HTMLInputElement>m.target).value),
            distinctUntilChanged(),
            debounceTime(this.delay),
          )
          .subscribe((value: string) => {
            this.query = value;
            this.setFilter();
          });
      }

      ngOnChanges(changes: SimpleChanges) {
        if (changes.query) {
          this.query = changes.query.currentValue;
          this.inputControl.setValue(this.query, {emitEvent: false});
        }
      }

      ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
      }

    // ngOnInit() {
    //     this.inputControl.valueChanges
    //         .pipe(
    //             distinctUntilChanged(),
    //             debounceTime(this.delay),
    //         )
    //         .subscribe((value: any) => {
    //             this.query = value !== null ? this.inputControl.value.toString() : '';
    //             if (this.query !== "" || this.canFilter) {
    //                 const ds = this.table.source as LocalDataSource;
    //                 ds.setPage(1, false);
    //                 this.setFilter();
    //             }
    //             this.canFilter = true;
    //         });
    // }

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes.query) {
    //         this.query = changes.query.currentValue;
    //         this.canFilter = !(this.query === '');
    //         if (this.isFirstTime)
    //             this.canFilter = true;
    //         this.isFirstTime = false;
    //         if (this.query === '')
    //             this.inputControl.setValue(this.query);
    //     }
    // }
}
