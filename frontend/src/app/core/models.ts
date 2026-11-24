/** Kiểu dữ liệu dùng chung, khớp với JSON mà backend trả về. */

export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

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
