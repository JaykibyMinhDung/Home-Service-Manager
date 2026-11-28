import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ heading() }}</h1>
        @if (subtitle()) {
          <div class="page-subtitle">{{ subtitle() }}</div>
        }
      </div>
      <div class="page-actions"><ng-content /></div>
    </div>
  `,
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly subtitle = input('');
}
