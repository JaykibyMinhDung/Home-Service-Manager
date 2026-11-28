import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  template: `
    <div class="bar-chart">
      @for (bar of bars(); track $index) {
        <div class="bar-column">
          <div class="bar-value">{{ bar.label }}</div>
          <div class="bar" [style.height.%]="bar.height"></div>
        </div>
      }
    </div>
    <div class="bar-chart-labels">
      @for (label of labels(); track $index) {
        <span>{{ label }}</span>
      }
    </div>
  `,
})
export class BarChart {
  readonly values = input.required<number[]>();
  readonly labels = input.required<string[]>();
  readonly format = input<(value: number) => string>((value) => value.toLocaleString('vi-VN'));

  protected readonly bars = computed(() => {
    const values = this.values();
    const max = Math.max(...values, 1);
    return values.map((value) => ({
      height: Math.round((value / max) * 100),
      label: value ? this.format()(value) : '',
    }));
  });
}
