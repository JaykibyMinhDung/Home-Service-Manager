# Thiết kế giao diện

Ảnh mockup của 15 màn hình, kèm 3 ảnh trạng thái phụ (hai hộp thoại, một bước xử lý đơn) và 1 ảnh tổng hợp bộ component dùng chung. Ảnh nằm trong thư mục [giao-dien](giao-dien/), chiều rộng 1280px.

Số màn hình theo [chuc-nang.md](chuc-nang.md).

## 1. Cách làm

- Mọi màn hình ghép từ một bộ component chung. Đổi một component là đổi trên tất cả các màn dùng nó.
- Mockup dùng đúng file CSS của ứng dụng thật (Bootstrap, `frontend/src/styles.css` và CSS của hai bố cục), nên màu, chữ và bố cục giống ứng dụng khi chạy.
- Dữ liệu trong ảnh là dữ liệu mẫu, khớp với bộ dữ liệu thử trong [test-case.md](test-case.md).

| File | Vai trò |
|---|---|
| `giao-dien/mockup/components.js` | Bộ component dùng chung, mỗi component một hàm |
| `giao-dien/mockup/components.css` | Kiểu của các component |
| `giao-dien/mockup/screens.js` | Định nghĩa từng màn bằng cách ghép component với dữ liệu mẫu |
| `giao-dien/mockup/index.html` | Mở trong trình duyệt để xem danh sách và từng màn |
| `giao-dien/mockup/xuat-anh.mjs` | Xuất lại toàn bộ ảnh PNG |

Sửa mockup xong thì xuất lại ảnh bằng lệnh sau, chạy từ thư mục gốc dự án:

```
node documents/giao-dien/mockup/xuat-anh.mjs
```

## 2. Bộ component dùng chung

![Bộ component dùng chung](giao-dien/00-component-chung.png)

| Component | Dùng để | Màn hình dùng |
|---|---|---|
| `CustomerLayout` | Bố cục trang khách hàng: thanh điều hướng trên cùng | 3, 4, 5, 6, 7 |
| `AdminLayout` | Bố cục trang quản trị: menu bên trái hiển thị theo vai trò | 3, 8, 9, 10, 11, 12, 13, 14, 15 |
| `AuthCard` | Khung trang đăng nhập và đăng ký | 1, 2 |
| `PageHeader` | Tiêu đề trang, dòng mô tả, nút thao tác chính | 3 đến 15 |
| `SectionCard` | Thẻ nội dung có tiêu đề | 3, 4, 5, 7, 9, 15 |
| `FormField` | Nhãn, ô nhập, gợi ý và thông báo lỗi | 1, 2, 3, 5, 7, 9, 10 đến 14 |
| `CheckList` | Chọn nhiều mục: dịch vụ kèm theo, nhân sự | 5, 9 |
| `Alert` | Thông báo thành công hoặc lỗi | 1, 2, 3, 7 |
| `DataTable` | Bảng dữ liệu, nút thao tác trên từng dòng, trạng thái trống | 6, 8, 10, 11, 12, 13, 14, 15 |
| `FilterTabs` | Lọc danh sách theo trạng thái, kèm số lượng | 6, 8 |
| `StatusBadge` | Nhãn trạng thái đơn, thanh toán, xe, nhân sự, danh mục, tài khoản | 6 đến 15 |
| `OrderSteps` | Thanh tiến độ bốn bước của đơn | 7, 9 |
| `OrderInfo` | Thông tin chuyển nhà của một đơn | 7, 9 |
| `CrewInfo` | Xe và đội vận chuyển được phân công | 7, 9 |
| `PriceSummary` | Bảng tính giá từng khoản và tổng | 5, 7, 9 |
| `PriceCard` | Thẻ giá loại xe và dịch vụ ở trang chủ | 4 |
| `StatCard` | Ô số liệu tổng hợp | 15 |
| `BarChart` | Biểu đồ cột doanh thu theo tháng | 15 |
| `Dialog` | Hộp thoại thêm, sửa, xác nhận xóa, nhập lý do hủy | 7, 9, 10 đến 14 |

Trong ứng dụng Angular hiện mới có `CustomerLayout` và `AdminLayout`. Các component còn lại sẽ được tạo trong `frontend/src/app/shared` khi code màn hình đầu tiên dùng tới chúng.

## 3. Màn hình dùng chung

### Màn 1: Đăng nhập

![Đăng nhập](giao-dien/01-dang-nhap.png)

### Màn 2: Đăng ký

Ảnh minh họa trạng thái một trường nhập sai.

![Đăng ký](giao-dien/02-dang-ky.png)

### Màn 3: Hồ sơ cá nhân

Ảnh là bản của khách hàng. Nhân viên và admin thấy cùng nội dung này bên trong bố cục quản trị.

![Hồ sơ cá nhân](giao-dien/03-ho-so-ca-nhan.png)

## 4. Màn hình của khách hàng

### Màn 4: Trang chủ và bảng giá

![Trang chủ và bảng giá](giao-dien/04-trang-chu-bang-gia.png)

### Màn 5: Đặt dịch vụ

Bảng giá ước tính bên phải cập nhật mỗi khi khách đổi thông tin.

![Đặt dịch vụ](giao-dien/05-dat-dich-vu.png)

### Màn 6: Đơn của tôi

![Đơn của tôi](giao-dien/06-don-cua-toi.png)

### Màn 7: Chi tiết đơn

Đơn đã xác nhận: khách thấy giá chốt, xe và đội được phân công.

![Chi tiết đơn của khách](giao-dien/07-chi-tiet-don-khach.png)

Đơn đang chờ xác nhận có nút Hủy đơn; bấm vào mở hộp thoại nhập lý do.

![Hộp thoại hủy đơn](giao-dien/07b-huy-don.png)

## 5. Màn hình của nhân viên và admin

Màn 8 và 9 chụp ở vai trò nhân viên, nên menu chỉ có Đơn hàng và Hồ sơ cá nhân.

### Màn 8: Danh sách đơn

![Danh sách đơn](giao-dien/08-danh-sach-don.png)

### Màn 9: Chi tiết và xử lý đơn

Cột bên phải đổi theo trạng thái của đơn. Đơn chờ xác nhận: nhập giá chốt, chọn xe và đội.

![Xử lý đơn chờ xác nhận](giao-dien/09-xu-ly-don-cho-xac-nhan.png)

Đơn đã xác nhận: bắt đầu thực hiện, hủy đơn và ghi nhận thanh toán. Khi đơn đang thực hiện, nút Bắt đầu thực hiện được thay bằng nút Hoàn thành.

![Xử lý đơn đã xác nhận](giao-dien/09b-xu-ly-don-da-xac-nhan.png)

## 6. Màn hình chỉ của admin

Năm màn danh mục (10 đến 14) cùng một khuôn: tiêu đề và nút thêm, bảng dữ liệu, hộp thoại để thêm và sửa.

### Màn 10: Loại xe và đơn giá

![Loại xe và đơn giá](giao-dien/10-loai-xe-don-gia.png)

Hộp thoại thêm loại xe. Các màn 11 đến 14 dùng cùng kiểu hộp thoại này với các trường của mình.

![Hộp thoại thêm loại xe](giao-dien/10b-them-loai-xe.png)

### Màn 11: Dịch vụ kèm theo

![Dịch vụ kèm theo](giao-dien/11-dich-vu-kem-theo.png)

### Màn 12: Xe

![Xe](giao-dien/12-xe.png)

### Màn 13: Đội vận chuyển

![Đội vận chuyển](giao-dien/13-doi-van-chuyen.png)

### Màn 14: Tài khoản nhân viên

![Tài khoản nhân viên](giao-dien/14-tai-khoan-nhan-vien.png)

### Màn 15: Thống kê

![Thống kê](giao-dien/15-thong-ke.png)
