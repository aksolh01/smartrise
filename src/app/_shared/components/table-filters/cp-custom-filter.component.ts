import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';

@Component({
    template: `
    <input
      [ngClass]="inputClass"
      [formControl]="inputControl"
      class="form-control"
      (keypress)="applyPattern($event)"
      [pattern]="column.filter.config.pattern"
      [placeholder]="column.title"
      type="column.filter.config.type">
  `,
  styleUrls: ['./cp-filter.component.scss']
})
export class CpCustomFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy {
    inputControl = new UntypedFormControl();
    source: BaseServerDataSource;
    private readonly _unsubscribeAll = new Subject<void>();
    private isReset: boolean | null = null;

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

    // required by library
    ngOnChanges(): void { }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    applyPattern(e) {

        e = e || window.event;
        const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
        const charStr = String.fromCharCode(charCode);
        const all = e.target.value + charStr;

        const regex = new RegExp(e.target.pattern, 'g');
        if (!regex.test(all)) {
            e.preventDefault();
        }
    }
}
