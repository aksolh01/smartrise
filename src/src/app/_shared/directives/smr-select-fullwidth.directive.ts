import { Directive, OnInit } from '@angular/core';
import { NbSelectComponent } from '@nebular/theme';

@Directive({
    selector: '[ngxSelectAutoWidth]'
})
export class NgxSelectAutoWidthDirective implements OnInit {
    constructor(private select: NbSelectComponent) { }

    ngOnInit(): void {
        this.select.optionsListClass = 'auto-width';
    }
}
