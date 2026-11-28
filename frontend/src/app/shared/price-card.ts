import { Component, input } from '@angular/core';
import { MoneyPipe } from './money.pipe';

@Component({
  selector: 'app-price-card',
  imports: [MoneyPipe],
  template: `
    <div class="price-card">
      <div class="price-card-name">{{ name() }}</div>
      <div class="price-card-desc">{{ description() }}</div>
      <div>
        <span class="price-card-amount">{{ amount() | money }}</span>
        <span class="text-secondary"> {{ unit() }}</span>
      </div>
    </div>
  `,
})
export class PriceCard {
  readonly name = input.required<string>();
  readonly description = input('');
  readonly amount = input.required<number>();
  readonly unit = input('');
}
