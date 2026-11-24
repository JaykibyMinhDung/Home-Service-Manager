import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ROLE_LABELS, Role } from '../core/models';

interface MenuItem {
  label: string;
  path: string;
  /** Vai trò được thấy mục này. */
  roles: Role[];
}

const MENU: MenuItem[] = [
  { label: 'Đơn hàng', path: '/admin/orders', roles: ['STAFF', 'ADMIN'] },
  { label: 'Loại xe và đơn giá', path: '/admin/vehicle-types', roles: ['ADMIN'] },
  { label: 'Dịch vụ kèm theo', path: '/admin/extra-services', roles: ['ADMIN'] },
  { label: 'Xe', path: '/admin/vehicles', roles: ['ADMIN'] },
  { label: 'Đội vận chuyển', path: '/admin/workers', roles: ['ADMIN'] },
  { label: 'Tài khoản nhân viên', path: '/admin/staff', roles: ['ADMIN'] },
  { label: 'Thống kê', path: '/admin/reports', roles: ['ADMIN'] },
  { label: 'Hồ sơ cá nhân', path: '/admin/profile', roles: ['STAFF', 'ADMIN'] },
];

/** Bố cục trang quản trị: menu bên trái hiển thị theo vai trò, nội dung bên phải. */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  protected readonly auth = inject(AuthService);
  protected readonly roleLabels = ROLE_LABELS;

  protected readonly menu = computed(() => {
    const role = this.auth.user()?.role;
    return role ? MENU.filter((item) => item.roles.includes(role)) : [];
  });
}
