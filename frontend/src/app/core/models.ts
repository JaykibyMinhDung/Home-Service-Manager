export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  active: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const ROLE_LABELS: Record<Role, string> = {
  CUSTOMER: 'Khách hàng',
  STAFF: 'Nhân viên',
  ADMIN: 'Quản trị viên',
};

export interface VehicleType {
  id: number;
  name: string;
  capacityKg: number;
  basePrice: number;
  pricePerKm: number;
  active: boolean;
}

export interface ExtraService {
  id: number;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
}

export type VehicleStatus = 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';

export interface Vehicle {
  id: number;
  licensePlate: string;
  vehicleType: VehicleType;
  status: VehicleStatus;
}

export type WorkerPosition = 'DRIVER' | 'PORTER';

export type WorkerStatus = 'AVAILABLE' | 'BUSY' | 'INACTIVE';

export interface Worker {
  id: number;
  fullName: string;
  phone: string;
  position: WorkerPosition;
  status: WorkerStatus;
}

export const POSITION_LABELS: Record<WorkerPosition, string> = {
  DRIVER: 'Tài xế',
  PORTER: 'Bốc xếp',
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'DEPOSITED' | 'PAID';
