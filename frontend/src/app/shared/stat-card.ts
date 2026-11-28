import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="stat-card">
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">{{ value() }}</div>
      <div class="stat-hint">{{ hint() }}</div>
    </div>
  `,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input('');
}
