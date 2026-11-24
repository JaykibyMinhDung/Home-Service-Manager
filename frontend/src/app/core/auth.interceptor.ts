import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Gắn token vào mọi request gửi tới backend.
 * Nếu backend trả 401 (token hết hạn hoặc tài khoản bị khóa) thì đăng xuất và về trang đăng nhập.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const isApiCall = req.url.startsWith('/api/');
  const isAuthCall = req.url.startsWith('/api/auth/');

  const request =
    token && isApiCall ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && isApiCall && !isAuthCall) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
