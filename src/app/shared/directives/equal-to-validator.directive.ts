import { Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[equalTo][ngModel]',
  standalone: false,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EqualToValidatorDirective),
      multi: true
    }
  ]
})
export class EqualToValidatorDirective implements Validator {
  @Input('equalTo') compareWith!: NgModel;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.compareWith?.control) {
      return null;
    }
    return control.value === this.compareWith.control.value ? null : { equalTo: true };
  }
}
