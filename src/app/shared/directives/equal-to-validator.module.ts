import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EqualToValidatorDirective } from './equal-to-validator.directive';

@NgModule({
  declarations: [EqualToValidatorDirective],
  exports: [EqualToValidatorDirective],
  imports: [FormsModule]
})
export class EqualToValidatorModule {}
