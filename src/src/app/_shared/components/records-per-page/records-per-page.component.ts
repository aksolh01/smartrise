import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { SelectHelperService } from '../../../services/select-helper.service';

@Component({
  selector: 'ngx-smr-records-per-page',
  template: `
    <div
      class="ngx-smr-records-per-page d-flex align-items-center"
      [class.flex-row-reverse]="flip"
    >
      <span [class.pr-2]="!flip" [class.pl-2]="flip">{{ label }}</span>
      <nb-select scrollStrategy="close"
                  (click)="onClick()"
                 [selected]="selected"
                 (selectedChange)="onRecordsNumberChanged($event)"
      >
        <nb-option *ngFor="let c of list" [value]="c">{{ c }}</nb-option>
      </nb-select>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsPerPageComponent implements OnDestroy {
  selected: number;
  list: number[] = [5, 10, 15, 20, 25];
  @Output() changed = new EventEmitter<number>();


  @Input() set recordsNumber(number: number) {
    this.selected = number;
    this._cdr.markForCheck();
  }

  @Input() label = 'Records Per Page';
  @Input() flip: boolean;

  @Input() set pageCountList(input: number[]) {
    if (input) {
      this.list = input;
      this._cdr.markForCheck();
    }
  }

  constructor(private _cdr: ChangeDetectorRef, private selectHelperService: SelectHelperService) {
  }

  onRecordsNumberChanged(input: number): void {
    this.selected = input;
    this.changed.emit(input);
  }

  onClick() {
    this.selectHelperService.allowOnScroll.next(false);
  }

  ngOnDestroy(): void {
    this.changed.complete();
    this.changed.unsubscribe();
  }
}
