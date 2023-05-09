import { UntypedFormControl, ValidatorFn } from '@angular/forms';

export const trimValidator: ValidatorFn = (control: UntypedFormControl) => {

  if (!control.value) {
    return null;
  }

  if (control.value.trim() === '') {
return null;
}
  if (control.value.startsWith(' ')) {
    return {
      trimError: { value: 'control has leading whitespace' },
    };
  }
  if (control.value.endsWith(' ')) {
    return {
      trimError: { value: 'control has trailing whitespace' },
    };
  }
  return null;
};
