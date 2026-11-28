import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ExtraService, VehicleType } from './models';

export interface VehicleTypeInput {
  name: string;
  capacityKg: number;
  basePrice: number;
  pricePerKm: number;
  active: boolean;
}

export interface ExtraServiceInput {
  name: string;
  description: string;
  price: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly api = inject(ApiService);

  vehicleTypes(includeInactive = false): Observable<VehicleType[]> {
    return this.api.get<VehicleType[]>('/api/vehicle-types', { includeInactive });
  }

  saveVehicleType(id: number | null, input: VehicleTypeInput): Observable<VehicleType> {
    return id === null
      ? this.api.post<VehicleType>('/api/admin/vehicle-types', input)
      : this.api.put<VehicleType>(`/api/admin/vehicle-types/${id}`, input);
  }

  deleteVehicleType(id: number): Observable<void> {
    return this.api.delete(`/api/admin/vehicle-types/${id}`);
  }

  extraServices(includeInactive = false): Observable<ExtraService[]> {
    return this.api.get<ExtraService[]>('/api/extra-services', { includeInactive });
  }

  saveExtraService(id: number | null, input: ExtraServiceInput): Observable<ExtraService> {
    return id === null
      ? this.api.post<ExtraService>('/api/admin/extra-services', input)
      : this.api.put<ExtraService>(`/api/admin/extra-services/${id}`, input);
  }

  deleteExtraService(id: number): Observable<void> {
    return this.api.delete(`/api/admin/extra-services/${id}`);
  }
}
