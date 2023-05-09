import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'smrRegexText',
  pure: true
})
export class RegexTestPipe implements PipeTransform {
  transform(regex: RegExp, str: string): boolean {
    if (regex && str && str.trim()) {
      return regex.test(str);
    }
    return false;
  }
}
