import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { CatalogService, ExtraServiceInput } from '../../core/catalog.service';
import { ExtraService } from '../../core/models';
import { DataTable } from '../../shared/data-table';
import { Dialog } from '../../shared/dialog';
import { FormField } from '../../shared/form-field';
import { MoneyPipe } from '../../shared/money.pipe';
import { PageHeader } from '../../shared/page-header';
import { StatusBadge } from '../../shared/status-badge';

@Component({
  selector: 'app-extra-services',
  imports: [ReactiveFormsModule, DataTable, Dialog, FormField, MoneyPipe, PageHeader, StatusBadge],
  templateUrl: './extra-services.html',
})
export class ExtraServices {
  private readonly catalog = inject(CatalogService);
  private readonly fb = inject(FormBuilder);

  protected readonly items = signal<ExtraService[]>([]);
  protected readonly loading = signal(true);
  protected readonly pageError = signal('');
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<ExtraService | null>(null);
  protected readonly deleting = signal<ExtraService | null>(null);
  protected readonly saving = signal(false);
  protected readonly dialogError = signal('');

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    active: [true],
  });

  constructor() {
    this.load();
  }

  protected openForm(item: ExtraService | null): void {
    this.editing.set(item);
    this.dialogError.set('');
    this.form.reset({
      name: item?.name ?? '',
      description: item?.description ?? '',
      price: item?.price ?? null,
      active: item?.active ?? true,
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
    const input = this.form.getRawValue() as ExtraServiceInput;
    this.catalog.saveExtraService(this.editing()?.id ?? null, input).subscribe({
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

  protected confirmDelete(item: ExtraService): void {
    this.dialogError.set('');
    this.deleting.set(item);
  }

  protected remove(): void {
    const item = this.deleting();
    if (!item) {
      return;
    }
    this.saving.set(true);
    this.catalog.deleteExtraService(item.id).subscribe({
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
    this.catalog.extraServices(true).subscribe({
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
