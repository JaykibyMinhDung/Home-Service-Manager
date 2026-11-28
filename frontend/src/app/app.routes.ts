import { Routes } from '@angular/router';
import { customerAreaGuard, guestGuard, roleGuard } from './core/auth.guard';
import { Login } from './features/auth/login';
import { ExtraServices } from './features/catalog/extra-services';
import { VehicleTypes } from './features/catalog/vehicle-types';
import { Vehicles } from './features/fleet/vehicles';
import { Workers } from './features/fleet/workers';
import { Register } from './features/auth/register';
import { Home } from './features/home/home';
import { Profile } from './features/profile/profile';
import { Reports } from './features/reports/reports';
import { Staff } from './features/staff/staff';
import { AdminLayout } from './layouts/admin-layout';
import { CustomerLayout } from './layouts/customer-layout';
import { ComingSoon } from './shared/coming-soon';

/**
 * Bảng định tuyến. Các màn hình chưa làm tạm dùng ComingSoon;
 * khi làm xong màn nào thì thay component ở dòng tương ứng.
 */
export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'Đăng nhập' },
  { path: 'register', component: Register, canActivate: [guestGuard], title: 'Đăng ký' },

  // Trang quản trị: nhân viên và admin dùng chung, menu hiển thị theo quyền.
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [roleGuard('STAFF', 'ADMIN')],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'orders' },
      { path: 'orders', component: ComingSoon, title: 'Đơn hàng' },
      { path: 'profile', component: Profile, title: 'Hồ sơ cá nhân' },
      {
        path: '',
        canActivate: [roleGuard('ADMIN')],
        children: [
          { path: 'vehicle-types', component: VehicleTypes, title: 'Loại xe và đơn giá' },
          { path: 'extra-services', component: ExtraServices, title: 'Dịch vụ kèm theo' },
          { path: 'vehicles', component: Vehicles, title: 'Xe' },
          { path: 'workers', component: Workers, title: 'Đội vận chuyển' },
          { path: 'staff', component: Staff, title: 'Tài khoản nhân viên' },
          { path: 'reports', component: Reports, title: 'Thống kê' },
        ],
      },
    ],
  },

  // Trang khách hàng: trang chủ xem được khi chưa đăng nhập, các trang còn lại cần tài khoản khách.
  {
    path: '',
    component: CustomerLayout,
    canActivate: [customerAreaGuard],
    children: [
      { path: '', pathMatch: 'full', component: Home, title: 'Dịch vụ chuyển nhà' },
      {
        path: '',
        canActivate: [roleGuard('CUSTOMER')],
        children: [
          { path: 'booking', component: ComingSoon, title: 'Đặt dịch vụ' },
          { path: 'my-orders', component: ComingSoon, title: 'Đơn của tôi' },
          { path: 'profile', component: Profile, title: 'Hồ sơ cá nhân' },
        ],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
