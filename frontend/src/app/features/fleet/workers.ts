import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { POSITION_LABELS, Worker, WorkerPosition, WorkerStatus } from '../../core/models';
import { DataTable } from '../../shared/data-table';
import { Dialog } from '../../shared/dialog';
import { FormField } from '../../shared/form-field';
import { PageHeader } from '../../shared/page-header';
import { StatusBadge, badgeLabel } from '../../shared/status-badge';
import { FleetService, WorkerInput } from './fleet.service';

@Component({
  selector: 'app-workers',
  imports: [ReactiveFormsModule, DataTable, Dialog, FormField, PageHeader, StatusBadge],
  templateUrl: './workers.html',
})
export class Workers {
  private readonly fleet = inject(FleetService);
  private readonly fb = inject(FormBuilder);

  protected readonly positionLabels = POSITION_LABELS;
  protected readonly positions: WorkerPosition[] = ['DRIVER', 'PORTER'];
  protected readonly statuses: { value: WorkerStatus; label: string }[] = (
    ['AVAILABLE', 'BUSY', 'INACTIVE'] as WorkerStatus[]
  ).map((value) => ({ value, label: badgeLabel('resource', value) }));

  protected readonly items = signal<Worker[]>([]);
  protected readonly loading = signal(true);
  protected readonly pageError = signal('');
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Worker | null>(null);
  protected readonly deleting = signal<Worker | null>(null);
  protected readonly saving = signal(false);
  protected readonly dialogError = signal('');

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    position: ['DRIVER' as WorkerPosition, Validators.required],
    status: ['AVAILABLE' as WorkerStatus],
  });

  constructor() {
    this.load();
  }

  protected openForm(item: Worker | null): void {
    this.editing.set(item);
    this.dialogError.set('');
    this.form.reset({
      fullName: item?.fullName ?? '',
      phone: item?.phone ?? '',
      position: item?.position ?? 'DRIVER',
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
    const input = this.form.getRawValue() as WorkerInput;
    this.fleet.saveWorker(this.editing()?.id ?? null, input).subscribe({
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

  protected confirmDelete(item: Worker): void {
    this.dialogError.set('');
    this.deleting.set(item);
  }

  protected remove(): void {
    const item = this.deleting();
    if (!item) {
      return;
    }
    this.saving.set(true);
    this.fleet.deleteWorker(item.id).subscribe({
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
    this.fleet.workers().subscribe({
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
