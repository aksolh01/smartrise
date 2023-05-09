import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { FunctionConstants } from '../../constants';

@Directive({
    selector: '[ngxValidator]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NgxValidatorDirective, multi: true }]
})
export class NgxValidatorDirective implements Validator {

    @Input() funcs = [];

    constructor(
        private el: ElementRef,
    ) {
    }

    validate(control: AbstractControl): ValidationErrors {
        const errors = {};
        this.funcs.forEach(f => {
            const r = FunctionConstants[f](control);
            for (const key in r) {
                errors[key] = r[key];
            }
        });

        if (Object.keys(errors).length === 0) {
            return null;
        } else {
            return errors;
        }
    }
    registerOnValidatorChange?(fn: () => void): void {
    }
}
