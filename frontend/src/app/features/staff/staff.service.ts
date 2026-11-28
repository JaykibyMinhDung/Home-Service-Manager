import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { User } from '../../core/models';

export interface StaffInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly api = inject(ApiService);

  list(): Observable<User[]> {
    return this.api.get<User[]>('/api/admin/staff');
  }

  create(input: StaffInput): Observable<User> {
    return this.api.post<User>('/api/admin/staff', input);
  }

  setActive(id: number, active: boolean): Observable<User> {
    return this.api.put<User>(`/api/admin/staff/${id}/active`, { active });
  }
}
