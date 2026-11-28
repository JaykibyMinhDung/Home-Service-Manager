import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Vehicle, VehicleStatus, Worker, WorkerPosition, WorkerStatus } from '../../core/models';

export interface VehicleInput {
  licensePlate: string;
  vehicleTypeId: number;
  status: VehicleStatus;
}

export interface WorkerInput {
  fullName: string;
  phone: string;
  position: WorkerPosition;
  status: WorkerStatus;
}

@Injectable({ providedIn: 'root' })
export class FleetService {
  private readonly api = inject(ApiService);

  vehicles(): Observable<Vehicle[]> {
    return this.api.get<Vehicle[]>('/api/admin/vehicles');
  }

  saveVehicle(id: number | null, input: VehicleInput): Observable<Vehicle> {
    return id === null
      ? this.api.post<Vehicle>('/api/admin/vehicles', input)
      : this.api.put<Vehicle>(`/api/admin/vehicles/${id}`, input);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.api.delete(`/api/admin/vehicles/${id}`);
  }

  workers(): Observable<Worker[]> {
    return this.api.get<Worker[]>('/api/admin/workers');
  }

  saveWorker(id: number | null, input: WorkerInput): Observable<Worker> {
    return id === null
      ? this.api.post<Worker>('/api/admin/workers', input)
      : this.api.put<Worker>(`/api/admin/workers/${id}`, input);
  }

  deleteWorker(id: number): Observable<void> {
    return this.api.delete(`/api/admin/workers/${id}`);
  }
}
