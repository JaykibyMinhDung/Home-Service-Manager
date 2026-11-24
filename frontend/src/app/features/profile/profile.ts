import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { AuthService } from '../../core/auth.service';
import { ROLE_LABELS } from '../../core/models';

/** Hồ sơ cá nhân: sửa họ tên, số điện thoại và đổi mật khẩu. Dùng chung cho mọi vai trò. */
@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly user = this.auth.user;
  protected readonly roleLabels = ROLE_LABELS;

  protected readonly profileForm = this.fb.group({
    fullName: [this.user()?.fullName ?? '', [Validators.required, Validators.maxLength(100)]],
    phone: [this.user()?.phone ?? '', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
  });
  protected readonly profileSaving = signal(false);
  protected readonly profileMessage = signal('');
  protected readonly profileError = signal('');

  protected readonly passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });
  protected readonly passwordSaving = signal(false);
  protected readonly passwordMessage = signal('');
  protected readonly passwordError = signal('');

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileSaving.set(true);
    this.profileMessage.set('');
    this.profileError.set('');
    const { fullName, phone } = this.profileForm.getRawValue();
    this.auth.updateProfile(fullName, phone).subscribe({
      next: () => {
        this.profileMessage.set('Đã lưu hồ sơ.');
        this.profileSaving.set(false);
      },
      error: (error: unknown) => {
        this.profileError.set(apiErrorMessage(error));
        this.profileSaving.set(false);
      },
    });
  }

  protected changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordSaving.set(true);
    this.passwordMessage.set('');
    this.passwordError.set('');
    const { oldPassword, newPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.passwordMessage.set('Đã đổi mật khẩu.');
        this.passwordForm.reset();
        this.passwordSaving.set(false);
      },
      error: (error: unknown) => {
        this.passwordError.set(apiErrorMessage(error));
        this.passwordSaving.set(false);
      },
    });
  }
}
