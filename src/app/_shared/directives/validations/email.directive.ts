import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { SmartriseValidators } from '../../constants';

@Directive({
    selector: '[email]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NgxEmailDirective, multi: true }]
})
export class NgxEmailDirective implements Validator {

    @Input() email = false;

    constructor(
        private el: ElementRef,
        private quotingService: QuotingToolService
    ) {
    }

    validate(control: AbstractControl): ValidationErrors {
        if (!this.email) {
            return null;
        }
        const v = SmartriseValidators.smartriseEmail(control);
        return v;
    }
    registerOnValidatorChange?(fn: () => void): void {
    }
}
