import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'value'
})
export class ValuePipe implements PipeTransform {
  transform(value: any, textIfNull?: string): string {
    return (value && value.trim()) || textIfNull || 'N/A';
  }
}
