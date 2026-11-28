import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import { AuthService } from '../../core/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { ExtraService, VehicleType } from '../../core/models';
import { PageHeader } from '../../shared/page-header';
import { PriceCard } from '../../shared/price-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PageHeader, PriceCard],
  templateUrl: './home.html',
})
export class Home {
  protected readonly auth = inject(AuthService);
  private readonly catalog = inject(CatalogService);

  protected readonly vehicleTypes = signal<VehicleType[]>([]);
  protected readonly extraServices = signal<ExtraService[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor() {
    this.catalog.vehicleTypes().subscribe({
      next: (items) => {
        this.vehicleTypes.set(items);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
    this.catalog.extraServices().subscribe({
      next: (items) => this.extraServices.set(items),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  protected vehicleDescription(type: VehicleType): string {
    return `Tải trọng ${type.capacityKg.toLocaleString('vi-VN')} kg · ${type.pricePerKm.toLocaleString('vi-VN')}đ mỗi km`;
  }
}
