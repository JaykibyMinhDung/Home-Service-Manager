# Hệ thống quản lý dịch vụ chuyển nhà: chức năng và phạm vi

## 1. Tổng quan

| Hạng mục | Số lượng |
|---|---|
| Vai trò | 3 |
| Chức năng | 19 |
| Màn hình | 15 |
| API | 40 |
| Bảng CSDL | 8 |

Công nghệ: Spring Boot (modular monolith), MySQL, Angular.

## 2. Vai trò

| Vai trò | Giao diện | Mô tả |
|---|---|---|
| Khách hàng | Trang khách hàng | Đặt dịch vụ, theo dõi và hủy đơn |
| Nhân viên | Trang quản trị | Xử lý đơn: xác nhận, phân công, cập nhật tiến độ, ghi nhận thanh toán |
| Admin | Trang quản trị | Làm được mọi việc của nhân viên, thêm quản lý danh mục, xe, đội vận chuyển, tài khoản nhân viên và thống kê |

Nhân viên và Admin dùng chung trang quản trị, menu hiển thị theo quyền. Đội vận chuyển (tài xế, bốc xếp) không có tài khoản đăng nhập.

## 3. Trạng thái

### Trạng thái đơn

| Trạng thái | Ý nghĩa | Chuyển sang được |
|---|---|---|
| Chờ xác nhận | Khách vừa đặt | Đã xác nhận, Đã hủy |
| Đã xác nhận | Nhân viên đã chốt giá và phân công xe, đội | Đang thực hiện, Đã hủy |
| Đang thực hiện | Đội đang chuyển đồ | Hoàn thành |
| Hoàn thành | Đã chuyển xong | Không |
| Đã hủy | Khách hoặc nhân viên hủy | Không |

### Trạng thái thanh toán

| Trạng thái | Ý nghĩa |
|---|---|
| Chưa thanh toán | Mặc định khi tạo đơn |
| Đã cọc | Khách đã đặt cọc |
| Đã thanh toán | Khách đã trả đủ |

## 4. Chức năng và happy case

### A. Tài khoản

| # | Chức năng | Ai dùng | Happy case |
|---|---|---|---|
| 1 | Đăng ký | Khách | Nhập họ tên, email, SĐT, mật khẩu → tạo tài khoản khách hàng → tự đăng nhập, vào trang chủ |
| 2 | Đăng nhập | Tất cả | Nhập email, mật khẩu → xác thực → vào trang khách hàng hoặc trang quản trị theo vai trò |
| 3 | Đăng xuất | Tất cả | Bấm đăng xuất → xóa phiên → về trang đăng nhập |
| 4 | Cập nhật hồ sơ, đổi mật khẩu | Tất cả | Sửa họ tên, SĐT hoặc nhập mật khẩu cũ và mới → lưu → báo thành công |

### B. Khách hàng

| # | Chức năng | Ai dùng | Happy case |
|---|---|---|---|
| 5 | Xem bảng giá | Khách | Mở trang chủ → thấy các loại xe, đơn giá và dịch vụ kèm theo |
| 6 | Đặt dịch vụ | Khách | Nhập địa chỉ đi và đến, ngày giờ, số km, số tầng, chọn loại xe và dịch vụ kèm → xem giá ước tính → bấm đặt → đơn ở trạng thái Chờ xác nhận |
| 7 | Xem đơn của tôi | Khách | Mở danh sách đơn → chọn một đơn → thấy chi tiết, trạng thái, giá chốt, xe và đội được phân công |
| 8 | Hủy đơn | Khách | Mở đơn đang Chờ xác nhận → bấm hủy, nhập lý do → đơn chuyển Đã hủy |

### C. Xử lý đơn

| # | Chức năng | Ai dùng | Happy case |
|---|---|---|---|
| 9 | Xem danh sách đơn | Nhân viên, Admin | Mở danh sách → lọc theo trạng thái → mở chi tiết đơn |
| 10 | Xác nhận đơn | Nhân viên, Admin | Mở đơn Chờ xác nhận → nhập giá chốt, chọn xe rảnh và đội rảnh → xác nhận → đơn chuyển Đã xác nhận |
| 11 | Cập nhật tiến độ | Nhân viên, Admin | Bấm Bắt đầu → đơn Đang thực hiện, xe và đội chuyển Bận. Bấm Hoàn thành → đơn Hoàn thành, xe và đội về Rảnh |
| 12 | Ghi nhận thanh toán | Nhân viên, Admin | Mở đơn → chọn Đã cọc hoặc Đã thanh toán → lưu |
| 13 | Hủy đơn | Nhân viên, Admin | Mở đơn chưa thực hiện → nhập lý do → đơn chuyển Đã hủy |

### D. Quản trị

| # | Chức năng | Ai dùng | Happy case |
|---|---|---|---|
| 14 | Quản lý loại xe và đơn giá | Admin | Thêm loại xe với tải trọng, giá mở cửa, giá theo km → lưu → hiện trong bảng giá |
| 15 | Quản lý dịch vụ kèm theo | Admin | Thêm dịch vụ với tên, mô tả, giá → lưu → khách chọn được khi đặt |
| 16 | Quản lý xe | Admin | Thêm xe với biển số, loại xe → lưu → xe ở trạng thái Rảnh |
| 17 | Quản lý đội vận chuyển | Admin | Thêm tài xế hoặc bốc xếp với họ tên, SĐT → lưu → ở trạng thái Rảnh |
| 18 | Quản lý tài khoản nhân viên | Admin | Tạo tài khoản nhân viên → nhân viên đăng nhập được; khóa hoặc mở khóa tài khoản |
| 19 | Xem thống kê | Admin | Chọn năm → thấy doanh thu theo tháng và số đơn theo trạng thái |

### Công thức giá ước tính (chức năng 6)

```
Giá ước tính = giá mở cửa của loại xe
             + số km × giá theo km của loại xe
             + (số tầng nơi đi + số tầng nơi đến) × phí mỗi tầng
             + tổng giá các dịch vụ kèm theo
```

- Phí mỗi tầng là một mức cố định, mặc định 50.000đ, đặt trong file cấu hình backend (`app.pricing.floor-fee`).
- Tầng trệt tính là 0, nên nhà ở tầng trệt không mất phụ phí tầng.
- Đây là giá ước tính; nhân viên nhập giá chốt khi xác nhận đơn.

## 5. Màn hình

| # | Màn hình | Ai dùng | Phục vụ chức năng |
|---|---|---|---|
| 1 | Đăng nhập | Tất cả | 2 |
| 2 | Đăng ký | Khách | 1 |
| 3 | Hồ sơ cá nhân | Tất cả | 3, 4 |
| 4 | Trang chủ và bảng giá | Khách | 5 |
| 5 | Đặt dịch vụ | Khách | 6 |
| 6 | Đơn của tôi | Khách | 7 |
| 7 | Chi tiết đơn (khách) | Khách | 7, 8 |
| 8 | Danh sách đơn | Nhân viên, Admin | 9 |
| 9 | Chi tiết và xử lý đơn | Nhân viên, Admin | 10, 11, 12, 13 |
| 10 | Loại xe và đơn giá | Admin | 14 |
| 11 | Dịch vụ kèm theo | Admin | 15 |
| 12 | Xe | Admin | 16 |
| 13 | Đội vận chuyển | Admin | 17 |
| 14 | Tài khoản nhân viên | Admin | 18 |
| 15 | Thống kê | Admin | 19 |

## 6. API theo nhóm

Chi tiết từng API: [api.md](api.md).

| Nhóm API | Nội dung | Số API |
|---|---|---|
| Tài khoản | Đăng ký, đăng nhập, xem hồ sơ, sửa hồ sơ, đổi mật khẩu | 5 |
| Bảng giá công khai | Danh sách loại xe, danh sách dịch vụ kèm theo | 2 |
| Đơn của khách | Tính giá, đặt đơn, danh sách đơn, chi tiết đơn, hủy đơn | 5 |
| Xử lý đơn | Danh sách, chi tiết, xác nhận, bắt đầu, hoàn thành, hủy, thanh toán, xe rảnh, đội rảnh | 9 |
| Quản trị loại xe | Thêm, sửa, xóa | 3 |
| Quản trị dịch vụ kèm theo | Thêm, sửa, xóa | 3 |
| Quản trị xe | Danh sách, thêm, sửa, xóa | 4 |
| Quản trị đội vận chuyển | Danh sách, thêm, sửa, xóa | 4 |
| Quản trị tài khoản nhân viên | Danh sách, tạo, khóa hoặc mở khóa | 3 |
| Thống kê | Doanh thu theo tháng, số đơn theo trạng thái | 2 |
| **Tổng** | | **40** |

## 7. Bảng CSDL

Chi tiết từng cột: [co-so-du-lieu.md](co-so-du-lieu.md).

| # | Bảng | Loại | Nội dung |
|---|---|---|---|
| 1 | `users` | Chính | Tài khoản khách hàng, nhân viên, admin; phân biệt bằng cột `role` |
| 2 | `vehicle_types` | Chính | Loại xe, tải trọng, giá mở cửa, giá theo km |
| 3 | `extra_services` | Chính | Dịch vụ kèm theo và giá |
| 4 | `vehicles` | Chính | Xe cụ thể: biển số, loại xe, trạng thái |
| 5 | `workers` | Chính | Đội vận chuyển: họ tên, SĐT, vị trí, trạng thái |
| 6 | `orders` | Chính | Đơn chuyển nhà: địa chỉ, thời gian, giá, trạng thái, thanh toán, xe được phân công |
| 7 | `order_services` | Nối | Đơn nào chọn dịch vụ kèm theo nào |
| 8 | `order_workers` | Nối | Đơn nào được phân công nhân sự nào |

## 8. Module backend

Mỗi module là một package trong `backend/src/main/java/com/movingservice`, chứa đủ entity, repository, service và controller của nó.

| Module | Nội dung |
|---|---|
| `auth` | Đăng nhập, đăng ký, JWT, phân quyền |
| `user` | Tài khoản, vai trò, hồ sơ, tài khoản nhân viên |
| `catalog` | Loại xe, đơn giá, dịch vụ kèm theo |
| `fleet` | Xe và đội vận chuyển |
| `order` | Đơn, tính giá, xử lý đơn, thanh toán |
| `report` | Thống kê |
| `common` | Xử lý lỗi và phần dùng chung |

## 9. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| [luong-chinh.md](luong-chinh.md) | 9 luồng nghiệp vụ chính, từng bước và ngoại lệ |
| [api.md](api.md) | Chi tiết 40 API |
| [co-so-du-lieu.md](co-so-du-lieu.md) | Chi tiết 8 bảng CSDL |
| [test-case.md](test-case.md) | 88 test case và kết quả chạy |
| [giao-dien.md](giao-dien.md) | Ảnh mockup từng màn hình và bộ component dùng chung |

## 10. Ngoài phạm vi

Thanh toán online, thông báo email hoặc SMS, bản đồ tính quãng đường, mã khuyến mãi, khiếu nại và bồi thường, xuất hóa đơn, ảnh hiện trạng đồ đạc.

Đánh giá dịch vụ (số sao và nhận xét) sẽ làm thêm nếu còn thời gian; khi đó cần thêm 1 bảng `reviews`.
