import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, UntypedFormControl, FormControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngx-smr-password-input',
  template: `
    <div class="input-holder">
      <input type="password" [id]="id" [placeholder]="placeholder" class="form-control" #input [formControl]="control"
             [maxlength]="maxLength" (focus)="showVals()" (blur)="hideVals()"/>
      <i class="toggle-icon far" *ngIf="!!control.value?.trim()" [tooltip]="tooltip" [class]="eyeIcon"
         (click)="toggleShowPassword()"></i>
    </div>
    <fieldset *ngIf="showValidations === true && validationShown" class="validations-container">
      <ul class="m-0 list-unstyled">
        <li *ngFor="let val of passwordValidations">
            <span class="d-inline-block validation-check">
              <i class="fas fa-check text-success" *ngIf="validateRule(val, val.rule | smrRegexText:control.value); else otherwise"></i>
              <ng-template #otherwise>
                <i class="fas fa-times text-danger"></i>
              </ng-template>
            </span>
          {{val.name}}
        </li>
      </ul>
    </fieldset>
  `,
  styles: [
    `
      .input-holder { position: relative; }
      .input-holder:hover .toggle-icon { display: flex; }
      .toggle-icon {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        display: none;
        align-items: center;
        padding: 0 15px;
        cursor: pointer;
        color: #000;
      }
      .toggle-icon:hover { display: flex; opacity: 0.8; }
      .validation-check { width: 20px; }
      .validation-check .fa-check { font-size: 0.9rem; }
      .validation-check .fa-times { font-size: 1.2rem; }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() id: string;
  @Input() placeholder: string;
  @Input() class: string;
  @Input() disable: boolean;
  @Input() formControl: UntypedFormControl;
  @Input() formControlName: string;
  @Input() maxLength = Infinity;
  @Input() showValidations = false;
  @ViewChild(FormControlDirective, { static: true }) formControlDirective: FormControlDirective;
  @ViewChild('input', { static: false }) inputRef: ElementRef<HTMLInputElement>;
  validationShown = true;

  eyeIcon: 'fa-eye' | 'fa-eye-slash' = 'fa-eye';
  tooltip: 'Show Password' | 'Hide Password' = 'Show Password';
  passwordValidations = [
    {
      name: 'At least 1 lowercase character.',
      rule: /[a-z]/,
      isValid: false,
    },
    {
      name: 'At least 1 uppercase character.',
      rule: /[A-Z]/,
      isValid: false,
    },
    {
      name: 'At least 1 number.',
      rule: /[0-9]/,
      isValid: false,
    },
    {
      name: 'At least 1 special character.',
      rule: /[^A-Za-z0-9]/,
      isValid: false,
    },
    {
      name: 'At least 8 characters long.',
      rule: /.{8,}/,
      isValid: false,
    }
  ];

  private _isShown = false;
  isIEOrEdge: boolean;

  get control() {
    return this.formControl || this.controlContainer.control.get(this.formControlName);
  }


  constructor(
    private _renderer2: Renderer2,
    private controlContainer: ControlContainer
  ) {
    this.isIEOrEdge = /msie\s|trident\/|edg\//i.test(window.navigator.userAgent);
  }

  toggleShowPassword(): void {
    if (this._isShown) {
      this._hide();
    } else {
      this._show();
    }
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnChange(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
  }

  showVals(): void {
    this.validationShown = true;
  }

  hideVals(): void {
    this.validationShown = this.passwordValidations.filter(pv => pv.isValid).length !== this.passwordValidations.length;
  }

  validateRule(value: any, isValid: boolean) {
    value.isValid = isValid;
    return isValid;
  }

  private _show(): void {
    this._renderer2.setAttribute(this.inputRef.nativeElement, 'type', 'text');
    this.eyeIcon = 'fa-eye-slash';
    this.tooltip = 'Hide Password';
    this._isShown = true;
  }

  private _hide(): void {
    this._renderer2.setAttribute(this.inputRef.nativeElement, 'type', 'password');
    this.eyeIcon = 'fa-eye';
    this.tooltip = 'Show Password';
    this._isShown = false;
  }
}
