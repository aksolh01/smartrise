import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';
import { FunctionConstants } from '../../constants';
import { allowOnlyNumbers } from '../../functions';

@Component({
    template: `
    <div class="form-container for-filter">
    <div class="input-container">
      <div class="input-item">
        <input
        #number
        [ngClass]="inputClass"
        [formControl]="inputControl"
        (keypress)="onKeyPress($event)"
        (paste)="processInput($event)"
        [placeholder]="column.title"
        type="text">
      </div>
    </div>
  </div>
  `,
    styleUrls: ['./cp-filter.component.scss']
})
export class CpFilterComponent extends DefaultFilter implements OnInit, OnChanges, OnDestroy {
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

    onKeyPress(e) {
        e = e || window.event;
        const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
        const charStr = String.fromCharCode(charCode);

        const _allowOnlyNumbers = this.column.filter?.config?.allowOnlyNumbers;
        if (_allowOnlyNumbers) {
            if (!allowOnlyNumbers(e)) {
                return;
            }
        }

        const mask = this.column.filter?.config?.mask?.toString();
        if (mask) {
            if (!FunctionConstants.applyMask(e, mask)) {
                return;
            }
        }
    }

    processInput(event: ClipboardEvent) {
        const _allowOnlyNumbers = this.column.filter?.config?.allowOnlyNumbers;
        if (!_allowOnlyNumbers) {
            return;
        }

        const clipboardText = event.clipboardData.getData('text');
        const value = clipboardText;
        let r: RegExp;
        r = new RegExp(`^[0-9]*$`);
        if (!r.test(value)) {
            event.preventDefault();
            return;
        }
    }

    private _isNumber(charOfInput: any): boolean {
        return !isNaN(+charOfInput);
    }

    private _isLetter(charOfInput: any): boolean {
        return /[a-zA-Z]/.test(charOfInput);
    }
}
