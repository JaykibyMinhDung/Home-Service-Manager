import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { CatalogService } from '../../core/catalog.service';
import { Vehicle, VehicleStatus, VehicleType } from '../../core/models';
import { DataTable } from '../../shared/data-table';
import { Dialog } from '../../shared/dialog';
import { FormField } from '../../shared/form-field';
import { PageHeader } from '../../shared/page-header';
import { StatusBadge, badgeLabel } from '../../shared/status-badge';
import { FleetService, VehicleInput } from './fleet.service';

@Component({
  selector: 'app-vehicles',
  imports: [ReactiveFormsModule, DataTable, Dialog, FormField, PageHeader, StatusBadge],
  templateUrl: './vehicles.html',
})
export class Vehicles {
  private readonly fleet = inject(FleetService);
  private readonly catalog = inject(CatalogService);
  private readonly fb = inject(FormBuilder);

  protected readonly statuses: { value: VehicleStatus; label: string }[] = (
    ['AVAILABLE', 'BUSY', 'MAINTENANCE'] as VehicleStatus[]
  ).map((value) => ({ value, label: badgeLabel('resource', value) }));

  protected readonly items = signal<Vehicle[]>([]);
  protected readonly vehicleTypes = signal<VehicleType[]>([]);
  protected readonly loading = signal(true);
  protected readonly pageError = signal('');
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Vehicle | null>(null);
  protected readonly deleting = signal<Vehicle | null>(null);
  protected readonly saving = signal(false);
  protected readonly dialogError = signal('');

  protected readonly form = this.fb.group({
    licensePlate: ['', [Validators.required, Validators.maxLength(20)]],
    vehicleTypeId: [null as number | null, Validators.required],
    status: ['AVAILABLE' as VehicleStatus],
  });

  constructor() {
    this.load();
    this.catalog.vehicleTypes(true).subscribe({
      next: (types) => this.vehicleTypes.set(types),
      error: (error: unknown) => this.pageError.set(apiErrorMessage(error)),
    });
  }

  protected openForm(item: Vehicle | null): void {
    this.editing.set(item);
    this.dialogError.set('');
    this.form.reset({
      licensePlate: item?.licensePlate ?? '',
      vehicleTypeId: item?.vehicleType.id ?? null,
      status: item?.status ?? 'AVAILABLE',
    });
    this.formOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.dialogError.set('');
    const input = this.form.getRawValue() as VehicleInput;
    this.fleet.saveVehicle(this.editing()?.id ?? null, input).subscribe({
      next: () => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.dialogError.set(apiErrorMessage(error));
      },
    });
  }

  protected confirmDelete(item: Vehicle): void {
    this.dialogError.set('');
    this.deleting.set(item);
  }

  protected remove(): void {
    const item = this.deleting();
    if (!item) {
      return;
    }
    this.saving.set(true);
    this.fleet.deleteVehicle(item.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.deleting.set(null);
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.dialogError.set(apiErrorMessage(error));
      },
    });
  }

  private load(): void {
    this.fleet.vehicles().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.pageError.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
