import { AbstractControl, ValidationErrors } from '@angular/forms';

export class LimitsValidator {
  static cannotBeEmpty(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === 0 || value === null) {
      return { cannotBeEmpty: true };
    }
    return null;
  }

  static maxLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      console.log('value', value);

      if (value && value.toString().length > length) {
        return { maxLength: true };
      }
      return null;
    };
  }
}
