import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';
import { NbDatepickerDirective } from '@nebular/theme';
import { FunctionConstants } from '../../constants';

@Component({
    template: `
        <div  (window:resize)="onResize($event)" class="form-container">
        <div class="input-container">
        <div class="input-item">
        <input
        [ngClass]="inputClass"
            [nbDatepicker]="datepicker"
            [formControl]="inputControl"
            (focus)="onFocus($event)"
            type="text"
            [placeholder]="column.title"
            (keydown)="keyPress($event)"
            >
        <nb-datepicker #datepicker [format]="'MM/dd/yyyy'"></nb-datepicker>
        </div>
        </div>
        </div>`,
    styleUrls: ['./cp-date-filter.component.scss']
})

export class CpDateFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @ViewChild('datepicker') datepicker: any;

    _nbDirective: any;
    private _isCleaning: boolean;
    @ViewChild(NbDatepickerDirective)
    set nbDatepicker(directive: any) {
        this._nbDirective = directive;
    }
    inputControl = new UntypedFormControl();
    canFilter = true;
    isFirstTime = true;
    dateFormat = '';
    source: BaseServerDataSource;
    private readonly _unsubscribeAll = new Subject<void>();
    private isReset: boolean | null = null;

    constructor() {
        super();
        this._unsubscribeAll = new Subject<void>();
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {

        this.delay = 0;
        this.source.reset$
            .pipe(
                takeUntil(this._unsubscribeAll)
            ).subscribe(() => {
                if (this.inputControl.value != null) {
                    this.isReset = true;
                    this.inputControl.setValue(null);
                }
            });

        this.source.clean$
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._isCleaning = true;
                this.inputControl.setValue(null);
            });

        this.inputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                distinctUntilChanged(),
                debounceTime(this.delay),
            )
            .subscribe((value: string) => {
                if (this._isCleaning) {
                    this._isCleaning = false;
                    return;
                }
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
        //     this.query = changes.query.currentValue;
        //     this.inputControl.setValue(this.query, { emitEvent: false });
        // }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onResize(event) {
        if (this._nbDirective.picker.isShown) {
            this._nbDirective.hidePicker();
        }
    }

    onFocus(event: any) {
        if (!event.target.value) {
this.datepicker.value = new Date();
}
    }

    keyPress(event: any) {
        FunctionConstants.applyMask(event, '99/99/9999');
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
