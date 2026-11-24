import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/** Trang chủ của khách hàng. Bảng giá sẽ được thêm vào đây khi làm chức năng xem bảng giá. */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly auth = inject(AuthService);
}
