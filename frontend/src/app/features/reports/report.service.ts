import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { OrderStatus } from '../../core/models';

export interface MonthlyRevenue {
  month: number;
  revenue: number;
  orderCount: number;
}

export interface StatusCount {
  status: OrderStatus;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly api = inject(ApiService);

  revenue(year: number): Observable<MonthlyRevenue[]> {
    return this.api.get<MonthlyRevenue[]>('/api/admin/reports/revenue', { year });
  }

  ordersByStatus(year: number): Observable<StatusCount[]> {
    return this.api.get<StatusCount[]>('/api/admin/reports/orders-by-status', { year });
  }
}
