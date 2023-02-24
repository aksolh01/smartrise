import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DefaultFilter } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { BaseServerDataSource } from '../../datasources/base-server.datasource';

@Component({
  template: ` <nb-checkbox
      checkbox-text-space="0rem"
      [checked]="checkStatus"
      *ngIf="onOffIsVisible"
      (checkedChange)="onOffCheckBoxChanged($event)"
    ></nb-checkbox>
    <nb-checkbox
      checkbox-text-space="0rem"
      [checked]="'false'"
      *ngIf="nullIsVisible"
      [indeterminate]="nullIsVisible"
      (checkedChange)="nullCheckBoxChanged($event)"
    ></nb-checkbox>`,
})
export class CpBooleanFilterComponent extends DefaultFilter implements OnInit, OnDestroy {
  @Output() filter: EventEmitter<string> = new EventEmitter();
  @Input() label: string;
  @Output() checked = new EventEmitter<boolean | null>();

  nullIsVisible = true;
  onOffIsVisible = false;
  _checkStatus?: boolean = null;
  isChecked?: boolean = null;
  inputControl = new UntypedFormControl();
  canFilter = true;
  isFirstTime = true;
  source: BaseServerDataSource;
  private readonly _unsubscribeAll = new Subject<void>();
  private isReset: boolean | null = null;

  constructor() {
    super();
    this._unsubscribeAll = new Subject<void>();
  }

  @Input() public get checkStatus(): boolean | null {
    return this._checkStatus;
  }

  public set checkStatus(value: boolean | null) {
    if (value === null) {
      this.nullIsVisible = true;
      this.onOffIsVisible = false;
    } else if (value === false) {
      this.nullIsVisible = false;
      this.onOffIsVisible = true;
    } else if (value === true) {
      this.nullIsVisible = false;
      this.onOffIsVisible = true;
    }
    this._checkStatus = value;
    this.checked.emit(value);
  }

  ngOnInit() {
    this.source.reset$.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.isReset = true;
      this.checkStatus = null;
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
    this.checked
      .pipe(
        takeUntil(this._unsubscribeAll),
        // map(m => (<HTMLInputElement>m.target).value),
        distinctUntilChanged(),
        debounceTime(this.delay)
      )
      .subscribe((value: any) => {
        if (!this.isReset) {
          this.filter.emit(value);
        } else {
          this.isReset = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // ngOnInit() {
  //     this.checked
  //         // .pipe(
  //         //     distinctUntilChanged(),
  //         //     debounceTime(this.delay),
  //         // )
  //         .subscribe((value: any) => {
  //             this.query = (value !== null ? this.checkStatus.toString() : '');
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
  //             this.checkStatus = null;
  //     }
  // }

  onOffCheckBoxChanged(event) {
    this.updateCheckings(event);
  }

  nullCheckBoxChanged(event) {
    this.updateCheckings(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateCheckings(actualStatus: boolean) {
    if (this.checkStatus === null) {
      this.checkStatus = false;
      this.onOffIsVisible = true;
      this.nullIsVisible = false;
    } else if (this.checkStatus) {
      this.checkStatus = null;

      this.onOffIsVisible = false;
      this.nullIsVisible = true;
    } else if (!this.checkStatus) {
      this.checkStatus = true;
      this.onOffIsVisible = true;
      this.nullIsVisible = false;
    }

    this.checked.emit(this._checkStatus);
  }
}
