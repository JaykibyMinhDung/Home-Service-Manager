import { HttpErrorResponse } from '@angular/common/http';

/** Đổi lỗi từ một lần gọi API thành câu thông báo hiển thị cho người dùng. */
export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.';
    }
    const message = error.error?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
    if (error.status === 403) {
      return 'Bạn không có quyền thực hiện thao tác này.';
    }
  }
  return 'Có lỗi xảy ra, vui lòng thử lại.';
}
