import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { apiErrorMessage } from '../../core/api-error';
import { BarChart } from '../../shared/bar-chart';
import { DataTable } from '../../shared/data-table';
import { MoneyPipe } from '../../shared/money.pipe';
import { PageHeader } from '../../shared/page-header';
import { SectionCard } from '../../shared/section-card';
import { StatCard } from '../../shared/stat-card';
import { StatusBadge } from '../../shared/status-badge';
import { MonthlyRevenue, ReportService, StatusCount } from './report.service';

@Component({
  selector: 'app-reports',
  imports: [BarChart, DataTable, PageHeader, SectionCard, StatCard, StatusBadge],
  templateUrl: './reports.html',
})
export class Reports {
  private readonly reports = inject(ReportService);
  private readonly money = new MoneyPipe();

  private readonly currentYear = new Date().getFullYear();
  protected readonly years = Array.from({ length: 5 }, (_, index) => this.currentYear - index);
  protected readonly monthLabels = Array.from({ length: 12 }, (_, index) => `T${index + 1}`);
  protected readonly formatMillion = (value: number) =>
    value.toLocaleString('vi-VN', { maximumFractionDigits: 1 });

  protected readonly year = signal(this.currentYear);
  protected readonly revenue = signal<MonthlyRevenue[]>([]);
  protected readonly statusCounts = signal<StatusCount[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly totalRevenue = computed(() =>
    this.money.transform(this.revenue().reduce((sum, row) => sum + row.revenue, 0)),
  );
  protected readonly totalOrders = computed(() =>
    this.statusCounts().reduce((sum, row) => sum + row.count, 0),
  );
  protected readonly revenueInMillions = computed(() =>
    this.revenue().map((row) => row.revenue / 1_000_000),
  );
  protected readonly sortedCounts = computed(() =>
    [...this.statusCounts()].sort((a, b) => b.count - a.count),
  );

  constructor() {
    this.load();
  }

  protected selectYear(value: string): void {
    this.year.set(Number(value));
    this.load();
  }

  protected countOf(status: StatusCount['status']): number {
    return this.statusCounts().find((row) => row.status === status)?.count ?? 0;
  }

  protected percent(count: number): string {
    const total = this.totalOrders();
    const value = total === 0 ? 0 : (count / total) * 100;
    return `${value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      revenue: this.reports.revenue(this.year()),
      statusCounts: this.reports.ordersByStatus(this.year()),
    }).subscribe({
      next: ({ revenue, statusCounts }) => {
        this.revenue.set(revenue);
        this.statusCounts.set(statusCounts);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
