import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { User } from '../../core/models';
import { DataTable } from '../../shared/data-table';
import { Dialog } from '../../shared/dialog';
import { FormField } from '../../shared/form-field';
import { PageHeader } from '../../shared/page-header';
import { StatusBadge } from '../../shared/status-badge';
import { StaffService } from './staff.service';

@Component({
  selector: 'app-staff',
  imports: [ReactiveFormsModule, DataTable, Dialog, FormField, PageHeader, StatusBadge],
  templateUrl: './staff.html',
})
export class Staff {
  private readonly staff = inject(StaffService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly items = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly pageError = signal('');
  protected readonly formOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly dialogError = signal('');
  protected readonly togglingId = signal<number | null>(null);

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
  });

  constructor() {
    this.load();
  }

  protected openForm(): void {
    this.dialogError.set('');
    this.form.reset();
    this.formOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.dialogError.set('');
    this.staff.create(this.form.getRawValue()).subscribe({
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

  protected toggleActive(item: User): void {
    this.togglingId.set(item.id);
    this.pageError.set('');
    this.staff.setActive(item.id, !item.active).subscribe({
      next: (updated) => {
        this.items.update((items) => items.map((user) => (user.id === updated.id ? updated : user)));
        this.togglingId.set(null);
      },
      error: (error: unknown) => {
        this.pageError.set(apiErrorMessage(error));
        this.togglingId.set(null);
      },
    });
  }

  private load(): void {
    this.staff.list().subscribe({
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
