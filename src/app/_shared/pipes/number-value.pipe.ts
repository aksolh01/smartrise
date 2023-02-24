import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberValue'
})
export class NumberValuePipe implements PipeTransform {
  transform(value?: number, textIfNull?: string): string {
    if(value === undefined || value === null) {
        if(textIfNull) {
            return textIfNull;
        }
        return 'N/A';
    }
    return value.toString();
  }
}
