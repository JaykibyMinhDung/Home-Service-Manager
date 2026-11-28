import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, Role, User } from './models';

const STORAGE_KEY = 'moving_auth';

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/** Giữ phiên đăng nhập (token và thông tin tài khoản) và gọi các API tài khoản. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly session = signal<AuthResponse | null>(readStoredSession());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);

  login(email: string, password: string): Observable<User> {
    return this.api
      .post<AuthResponse>('/api/auth/login', { email, password })
      .pipe(map((response) => this.startSession(response)));
  }

  register(data: RegisterData): Observable<User> {
    return this.api
      .post<AuthResponse>('/api/auth/register', data)
      .pipe(map((response) => this.startSession(response)));
  }

  logout(): void {
    this.setSession(null);
    this.router.navigateByUrl('/login');
  }

  updateProfile(fullName: string, phone: string): Observable<User> {
    return this.api.put<User>('/api/users/me', { fullName, phone }).pipe(
      tap((user) => {
        const current = this.session();
        if (current) {
          this.setSession({ ...current, user });
        }
      }),
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.api.put<void>('/api/users/me/password', { oldPassword, newPassword });
  }

  /** Trang mặc định sau khi đăng nhập, tùy vai trò. */
  homeUrl(role: Role | undefined = this.user()?.role): string {
    return role === 'STAFF' || role === 'ADMIN' ? '/admin' : '/';
  }

  private startSession(response: AuthResponse): User {
    this.setSession(response);
    return response.user;
  }

  private setSession(session: AuthResponse | null): void {
    this.session.set(session);
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Trình duyệt chặn localStorage: phiên vẫn dùng được cho tới khi tải lại trang.
    }
  }
}

function readStoredSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<AuthResponse>;
    return parsed.token && parsed.user ? (parsed as AuthResponse) : null;
  } catch {
    return null;
  }
}
