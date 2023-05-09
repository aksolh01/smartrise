import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { SmartriseValidators } from '../../constants';

@Directive({
    selector: '[requiredWithTrim]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NgxRequiredWithTrimDirective, multi: true }]
})
export class NgxRequiredWithTrimDirective implements Validator {

    @Input() requiredWithTrim = false;

    constructor(
        private el: ElementRef,
        private quotingService: QuotingToolService
    ) {
    }

    validate(control: AbstractControl): ValidationErrors {
        if (!this.requiredWithTrim) {
            return null;
        }
        const v = SmartriseValidators.requiredWithTrim(control);
        return v;
    }
    registerOnValidatorChange?(fn: () => void): void {
    }
}
