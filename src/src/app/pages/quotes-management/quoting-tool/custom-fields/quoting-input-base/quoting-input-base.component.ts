import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { guid } from '../../../../../_shared/functions';
import { AssumeEventArg } from '../../business/types';

@Component({
  selector: 'ngx-quoting-input-base',
  templateUrl: './quoting-input-base.component.html',
  styleUrls: ['./quoting-input-base.component.scss'],
})
export class QuotingInputBaseComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges/*, IValidatorComponent*/ {

  @Input() tooltip = '';
  @Input() disableQuotingValidation = false;
  @Input() busyMessage = '';
  @Input() isBusy = false;
  @Input() item: any;
  @Input() valueField: string;
  @Input() fieldLabel: string;
  @Input() carRef: string;
  @Input() carLabel: string;
  @Input() carIndex: number;
  @Input() placeholder: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() isInlineErrors = false;
  @Input() suffixComponent: any;
  @Input() required = false;
  @Input() allowSpace = true;
  @Input() email = false;
  @Input() showAssume = false;
  @Input() assumeField: string;
  @Input() assumedValue: any = '';
  @Input() infoText: string;
  @Input() index: number;

  @Output() infoClick = new EventEmitter<void>();
  @Output() assumeChanged = new EventEmitter<any>();
  @Output('valueChanged') changed = new EventEmitter<any>();

  @ViewChild('i') i;
  @ViewChild('field') field;

  trimErrorMessage = `This field can't start or end with a blank space`;
  errors: any[] = [];
  isBeingDestroyed = false;
  showErrors = false;
  hasErrors = false;
  blink = false;

  subscriptions: Subscription[] = [];

  preconditionCallbacks: Function[] = [];
  assumeCallbacks: Function[] = [];
  validateCallbacks: Function[] = [];

  protected _oldValue: any;
  private _blinkingDuration = 2000;
  isHidden = false;

  id: string;

  constructor(private quotingToolValidationService: QuotingToolValidationService, private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required'] && !changes.required.firstChange && changes.required.previousValue !== changes.required.currentValue) {
      setTimeout(() => this.field.control.patchValue(this.item[this.valueField]));
    }
  }

  ngOnDestroy(): void {
    this.isBeingDestroyed = true;
    this._clearFieldErrors();
    this.subscriptions.filter(sub => sub != null).forEach(sub => {
      sub.unsubscribe();
    });
  }

  private _clearFieldErrors() {
    this.quotingToolValidationService.errorChanged.next({
      carIndex: this.carIndex,
      index: this.index,
      carRef: this.carRef,
      carLabel: this.carLabel,
      instance: this.item,
      field: this.fieldLabel ? this.fieldLabel : this.valueField,
      errors: [],
      id: this.id,
      tab: '',
    });
    this.notifySort();
  }

  onInfoClick(event) {
    this.infoClick.next();
  }

  ngAfterViewInit(): void {
    if(this.item) {
      this._oldValue = this.item[this.valueField];
    }
  }

  notifySort() {
    this.quotingToolValidationService.notifySort();
  }

  ngOnInit(): void {

    this.index = this.quotingToolValidationService.getIndex();
    this.id = guid();
    this.isBeingDestroyed = false;

    this.subscriptions.push(this.quotingToolValidationService.clearsRules.subscribe(() => {
      this.validateCallbacks.splice(0, this.validateCallbacks.length);
      this.assumeCallbacks.splice(0, this.assumeCallbacks.length);
    }));
    this.subscriptions.push(this.quotingToolValidationService.pushRules.subscribe((rule) => {
      if (rule.field.name === this.valueField && this.item instanceof rule.field.type) {

        if (rule.field.name === 'motorHP') {
          console.log();
        }

        if (rule.trigger === 'assume') {
          this.assumeCallbacks.push(...rule.functions);
        } else if (rule.trigger === 'validate' || rule.trigger === 'change') {
          this.validateCallbacks.push(...rule.functions);
        } else if (rule.trigger === 'precondition') {
          this.preconditionCallbacks.push(...rule.functions);
        }
      }
    }));
    this.subscriptions.push(this.quotingToolValidationService.visibilityChanged.subscribe((args) => {
      if (this.item === args.instance) {
        const oldIsHidden = this.isHidden;
        this.isHidden = args.hide;
        if (args.hide) {
          this._clearFieldErrors();
        } else if (oldIsHidden) {
          setTimeout(() => {
            this.validateValue(this.item[this.valueField]);
            this.notifySort();
          });
        }
      }
    }));
    this.subscriptions.push(this.quotingToolValidationService.focus.subscribe((id) => {
      if (id === this.id) {
        this.blink = true;
        if (this.i['hostRef']) {
          this.i['hostRef'].nativeElement.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            this.blink = false;
          }, this._blinkingDuration);
        } else {
          this.i.nativeElement.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            this.blink = false;
          }, this._blinkingDuration);
        }
      }
    }));

    this.subscriptions.push(this.quotingToolValidationService.validate.pipe(filter(x => {

      if (!x) {
        return true;
      }

      if (x.field) {
        return this.valueField === x.field && this.item === x.instance;
      } else if (x.instance) {
        return this.item === x.instance;
      } else {
        return true;
      }
    })).subscribe(() => {
      this.validateValue(this.item[this.valueField]);
    }));
  }

  unAssume() {
    this.item[this.assumeField] = false;
  }

  validateValue(event) {

    if (this.isHidden) {
      this._clearFieldErrors();
      return;
    }

    this.transformValue(event);

    if (event === '') {
      event = undefined;
    }

    this.errors.splice(0, this.errors.length);
    const errors = [];
    if (!this.isBeingDestroyed) {
      for (const fn of this.validateCallbacks) {
        const error = fn(this.item, {
          newValue: event,
          oldValue: this._oldValue,
          changed: this.isChanged(this._oldValue, event)
        });
        if (error) {
          this.errors.push(error);
          break;
        }
      }
      this._oldValue = event;
      errors.push(...this.errors);
    }
    this._sendErrors(errors);
  }

  private _sendErrors(fErrors: any[]) {
    this.quotingToolValidationService.errorChanged.next({
      carIndex: this.carIndex,
      index: this.index,
      carRef: this.carRef,
      carLabel: this.carLabel,
      instance: this.item,
      field: this.fieldLabel ? this.fieldLabel : this.valueField,
      errors: fErrors,
      id: this.id,
      tab: '',
    });
    this.hasErrors = fErrors.length > 0;
  }

  protected isChanged(oldValue: any, newValue: any) {
    if (
      (oldValue == null || oldValue === '') &&
      (newValue == null || newValue === '')
    ) {
return false;
}
    return oldValue !== newValue;
  }

  transformValue(value: any): void {
  }

  set value(val: any) {
    this.item[this.valueField] = val;
  }

  get value(): any {
    return this.item[this.valueField];
  }

  onAssumeChange(event) {
    let canceled = false;
    const params: AssumeEventArg = {
      cancel: () => {
        canceled = true;
      },
      item: this.item,
      newValue: event,
      assumedValue: this.assumedValue
    };
    this.assumeChanged.next(params);
    this.assumeCallbacks.forEach(fn => {
      fn(this.item, params);
    });
    if (!canceled) {
      this.item[this.assumeField] = event;

      //This is intentianlly set in timeout callback as workaround for an
      //Issue in toggle button. Please do not remove
      setTimeout(() => this.item[this.assumeField] = event, 20);

      if (event) {
        this.value = params.assumedValue;
      }
      this.validateValue(this.item[this.valueField]);
      this.notifySort();
      this._oldValue = this.item[this.valueField];
    } else {
      setTimeout(() => this.item[this.assumeField] = !event, 100);
    }
  }
}
