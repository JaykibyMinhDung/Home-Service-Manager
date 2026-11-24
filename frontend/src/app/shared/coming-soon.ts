import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** Trang giữ chỗ cho các màn hình chưa làm. Tiêu đề lấy từ thuộc tính title của route. */
@Component({
  selector: 'app-coming-soon',
  template: `
    <h1 class="page-title">{{ title }}</h1>
    <div class="card">
      <div class="card-body text-secondary">Màn hình này chưa được xây dựng.</div>
    </div>
  `,
})
export class ComingSoon {
  protected readonly title = inject(ActivatedRoute).snapshot.title ?? '';
}
