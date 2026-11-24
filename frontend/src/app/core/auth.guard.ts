import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

/** Chỉ cho vào khi đã đăng nhập và có một trong các vai trò được liệt kê. */
export function roleGuard(...roles: Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.user();
    if (!user) {
      return router.parseUrl('/login');
    }
    return roles.includes(user.role) ? true : router.parseUrl(auth.homeUrl());
  };
}

/** Trang đăng nhập và đăng ký: đã đăng nhập rồi thì chuyển về trang chính của vai trò. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? inject(Router).parseUrl(auth.homeUrl()) : true;
};

/** Khu vực khách hàng: nhân viên và admin được chuyển sang trang quản trị. */
export const customerAreaGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const role = auth.user()?.role;
  return role === 'STAFF' || role === 'ADMIN' ? inject(Router).parseUrl('/admin') : true;
};
