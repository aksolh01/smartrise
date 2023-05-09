import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'usdate' })
export class USDatePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {

    }

    transform(input: Date): string {
        return input
            ? this.datePipe.transform(input, 'MM/dd/yyyy')
            : '';
    }
}
