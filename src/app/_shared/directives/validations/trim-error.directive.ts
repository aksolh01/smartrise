import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { SmartriseValidators } from '../../constants';

@Directive({
    selector: '[trimError]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NgxTrimErrorDirective, multi: true }]
})
export class NgxTrimErrorDirective implements Validator {

    @Input() trimError = false;

    constructor(
        private el: ElementRef,
    ) {
    }

    validate(control: AbstractControl): ValidationErrors {
        if(!this.trimError) {
            return null;
        }
        const v = SmartriseValidators.trimError(control);
        return v;
    }
    registerOnValidatorChange?(fn: () => void): void {
    }
}
