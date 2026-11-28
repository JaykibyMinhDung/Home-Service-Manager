import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  template: `
    <div class="mb-3">
      <label class="form-label" [attr.for]="fieldId()">{{ label() }}</label>
      <div [class.input-group]="suffix()" [class.has-validation]="suffix()">
        <ng-content />
        @if (suffix()) {
          <span class="input-group-text">{{ suffix() }}</span>
        }
      </div>
      @if (showError()) {
        <div class="invalid-feedback d-block">{{ error() }}</div>
      }
      @if (hint()) {
        <div class="form-text">{{ hint() }}</div>
      }
    </div>
  `,
})
export class FormField {
  readonly label = input.required<string>();
  readonly fieldId = input('');
  readonly control = input<AbstractControl | null>(null);
  readonly error = input('');
  readonly hint = input('');
  readonly suffix = input('');

  protected showError(): boolean {
    const control = this.control();
    return !!control && control.invalid && control.touched && !!this.error();
  }
}
