import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  template: `
    <section class="section-card">
      @if (heading()) {
        <h2 class="section-title">{{ heading() }}</h2>
      }
      <ng-content />
    </section>
  `,
})
export class SectionCard {
  readonly heading = input('');
}
