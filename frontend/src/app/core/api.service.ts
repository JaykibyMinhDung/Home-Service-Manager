import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './models';

type Params = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(url: string, params?: Params): Observable<T> {
    return this.http.get<ApiResponse<T>>(url, { params }).pipe(map((response) => response.data));
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(map((response) => response.data));
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(url, body).pipe(map((response) => response.data));
  }

  delete(url: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(url).pipe(map(() => undefined));
  }
}
