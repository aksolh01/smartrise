import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';

@Component({
    template: `
    <div class="form-container for-filter">
        <div class="input-container">
            <div class="input-item">
                <input
                #number
                [ngClass]="inputClass"
                [formControl]="inputControl"
                class="form-control"
                (paste)="onPaste($event)"
                (keypress)="preventNonNumericalInput($event)"
                [min]="column.filter.config.min"
                [placeholder]="column.title"
                type="number">
            </div>
        </div>
    </div>
  `,
    styleUrls: ['./cp-filter.component.scss']
})
export class CpNumberFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy {
    inputControl = new UntypedFormControl();
    source: BaseServerDataSource;
    private readonly _unsubscribeAll = new Subject<void>();
    private isReset: boolean | null = null;
    @ViewChild('number') number: any;

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

    preventNonNumericalInput(e) {

        e = e || window.event;
        const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
        const charStr = String.fromCharCode(charCode);

        const min = this.column.filter.config.min;

        if (isNaN(+(e.target.value + charStr))) {
            e.preventDefault();
            return;
        }


        if (+(e.target.value + charStr) < min) {
            e.preventDefault();
            return;
        }

        if (min > 0) {
            if (!charStr.match(/^[0-9]+$/)) {
e.preventDefault();
}
        }
    }

    onPaste(event: ClipboardEvent) {
        const clipboardText = event.clipboardData.getData('text');
        const value = clipboardText;
        let r: RegExp;
        r = new RegExp(`^[0-9]$`);
        let output = '';
        let firstDotEncountered = false;
        for (let i = 0; i < clipboardText.length; i++) {
            const ch = clipboardText.charAt(i);
            if (ch === '.') {
                if (firstDotEncountered) {
                    continue;
                }
                firstDotEncountered = true;
                output = output + ch;
            } else if (r.test(ch)) {
                output = output + ch;
            }
        }
        if (!r.test(value)) {
            event.preventDefault();
            this.number.nativeElement.value = output;
            const v: any = +output;
            this.filter.emit(v);
            return;
        }
    }
}
