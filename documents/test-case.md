# Tài liệu test case

Tổng cộng 88 test case, chia 8 nhóm. Cột "CN" là số chức năng trong [chuc-nang.md](chuc-nang.md); các luồng tương ứng nằm trong [luong-chinh.md](luong-chinh.md).

## 1. Tổng hợp

| Nhóm | Mã | Số test case | Đạt | Chưa chạy |
|---|---|---|---|---|
| Tài khoản | TK | 15 | 10 | 5 |
| Phân quyền | PQ | 10 | 5 | 5 |
| Bảng giá | BG | 2 | 0 | 2 |
| Đặt dịch vụ và đơn của khách | DH | 14 | 0 | 14 |
| Xử lý đơn | XL | 21 | 0 | 21 |
| Quản trị | QT | 19 | 0 | 19 |
| Thống kê | TKE | 4 | 0 | 4 |
| Luồng đầu cuối | E2E | 3 | 0 | 3 |
| **Tổng** | | **88** | **15** | **73** |

Cập nhật ngày 24/11/2026. Các nhóm BG, DH, XL, QT, TKE, E2E chưa chạy được vì chức năng tương ứng chưa được xây dựng.

### Giá trị của cột "Kết quả"

| Giá trị | Ý nghĩa |
|---|---|
| Đạt (tự động) | Đã qua kiểm thử tự động trong `backend/src/test/java/com/movingservice/AuthFlowTest.java`. Kiểm thử này gọi thẳng API, nên phần hiển thị trên giao diện của test case đó chưa được thử |
| Đạt (trình duyệt) | Đã thử tay trên giao diện |
| Chưa chạy | Chưa kiểm thử |
| Không đạt | Kết quả thực tế khác mong đợi; ghi mô tả lỗi bên cạnh |

## 2. Dữ liệu thử

Tạo sẵn bộ dữ liệu này trước khi chạy các nhóm BG, DH, XL, QT, TKE và E2E.

### Tài khoản

| Vai trò | Email | Ghi chú |
|---|---|---|
| Admin | `admin@moving.local` | Tự tạo ở lần chạy đầu; mật khẩu trong `application.properties` |
| Nhân viên | `nhanvien1@test.local` | Admin tạo ở test case QT-16 |
| Khách A | `khacha@test.local` | Tự đăng ký |
| Khách B | `khachb@test.local` | Tự đăng ký, dùng để thử khách này không xem được đơn của khách kia |

Mật khẩu các tài khoản thử do người kiểm thử tự đặt, từ 6 ký tự.

### Danh mục

| Loại | Tên | Giá trị |
|---|---|---|
| Loại xe | Xe tải 1 tấn | Tải trọng 1.000 kg, giá mở cửa 300.000đ, 15.000đ mỗi km |
| Loại xe | Xe tải 2 tấn | Tải trọng 2.000 kg, giá mở cửa 500.000đ, 20.000đ mỗi km |
| Dịch vụ kèm theo | Đóng gói đồ đạc | 200.000đ |
| Dịch vụ kèm theo | Tháo lắp nội thất | 300.000đ |
| Xe | 29C-111.11 | Loại Xe tải 1 tấn |
| Xe | 29C-222.22 | Loại Xe tải 1 tấn |
| Nhân sự | Tài xế 1 | Vị trí Tài xế |
| Nhân sự | Bốc xếp 1, Bốc xếp 2 | Vị trí Bốc xếp |
| Phí mỗi tầng | | 50.000đ |

## 3. Tài khoản (TK)

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| TK-01 | 1 | Đăng ký thành công | Email chưa được dùng | Mở Đăng ký, nhập đủ bốn trường hợp lệ, bấm Đăng ký | Tạo tài khoản vai trò Khách hàng, tự đăng nhập, vào trang chủ | Đạt (tự động, trình duyệt) |
| TK-02 | 1 | Đăng ký bằng email đã dùng | Đã có tài khoản với email đó | Đăng ký lại bằng cùng email, khác chữ hoa thường | Báo "Email đã được sử dụng", không tạo tài khoản | Đạt (tự động) |
| TK-03 | 1 | Đăng ký với email sai định dạng | | Nhập email `khong-phai-email`, bấm Đăng ký | Báo "Email không đúng định dạng" | Đạt (tự động) |
| TK-04 | 1 | Đăng ký với SĐT sai định dạng | | Nhập SĐT 9 chữ số hoặc không bắt đầu bằng 0 | Báo "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0" | Chưa chạy |
| TK-05 | 1 | Đăng ký với mật khẩu ngắn | | Nhập mật khẩu 5 ký tự | Báo mật khẩu từ 6 ký tự, không tạo tài khoản | Chưa chạy |
| TK-06 | 1 | Đăng ký bỏ trống trường bắt buộc | | Để trống họ tên, bấm Đăng ký | Báo lỗi ở trường bị trống, không gửi lên server | Chưa chạy |
| TK-07 | 2 | Khách đăng nhập thành công | Có tài khoản khách | Nhập đúng email và mật khẩu | Vào trang chủ, thanh điều hướng hiện tên khách | Đạt (tự động) |
| TK-08 | 2 | Admin đăng nhập thành công | Có tài khoản admin mặc định | Nhập email và mật khẩu admin | Vào trang quản trị, mục Đơn hàng | Đạt (tự động, trình duyệt) |
| TK-09 | 2 | Đăng nhập sai mật khẩu | Có tài khoản | Nhập đúng email, sai mật khẩu | Báo "Email hoặc mật khẩu không đúng", ở lại trang Đăng nhập | Đạt (tự động, trình duyệt) |
| TK-10 | 2 | Đăng nhập bằng email không tồn tại | | Nhập email chưa đăng ký | Báo "Email hoặc mật khẩu không đúng" | Chưa chạy |
| TK-11 | 2 | Đăng nhập bằng tài khoản bị khóa | Tài khoản nhân viên đã bị khóa | Nhập đúng email và mật khẩu | Báo "Email hoặc mật khẩu không đúng" | Chưa chạy |
| TK-12 | 3 | Đăng xuất | Đã đăng nhập | Bấm Đăng xuất | Xóa phiên, về trang Đăng nhập | Đạt (trình duyệt) |
| TK-13 | 4 | Sửa hồ sơ | Đã đăng nhập | Mở Hồ sơ, đổi họ tên và SĐT, bấm Lưu | Báo "Đã lưu hồ sơ", tên mới hiện trên thanh điều hướng | Đạt (tự động) |
| TK-14 | 4 | Đổi mật khẩu thành công | Đã đăng nhập | Nhập đúng mật khẩu cũ và mật khẩu mới, bấm Đổi; đăng xuất; đăng nhập bằng mật khẩu mới | Báo "Đã đổi mật khẩu"; đăng nhập bằng mật khẩu mới thành công | Đạt (tự động) |
| TK-15 | 4 | Đổi mật khẩu với mật khẩu cũ sai | Đã đăng nhập | Nhập sai mật khẩu cũ | Báo "Mật khẩu cũ không đúng", mật khẩu không đổi | Đạt (tự động) |

## 4. Phân quyền (PQ)

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| PQ-01 | 2 | Gọi API cần đăng nhập khi không có token | | Gọi `GET /api/users/me` không kèm header | Mã 401 | Đạt (tự động) |
| PQ-02 | 2 | Gọi API với token sai | | Gọi `GET /api/users/me` với token bịa | Mã 401 | Đạt (tự động) |
| PQ-03 | 2 | Khách gọi API của nhân viên và admin | Đăng nhập là khách | Gọi `GET /api/staff/orders` và `GET /api/admin/staff` | Mã 403 ở cả hai | Đạt (tự động) |
| PQ-04 | 2 | Khách mở trang quản trị | Đăng nhập là khách | Gõ địa chỉ `/admin` | Bị chuyển về trang chủ | Đạt (trình duyệt) |
| PQ-05 | 2 | Nhân viên gọi API của admin | Đăng nhập là nhân viên | Gọi `GET /api/admin/staff` | Mã 403 | Chưa chạy |
| PQ-06 | 2 | Menu của nhân viên | Đăng nhập là nhân viên | Xem menu trang quản trị; gõ địa chỉ `/admin/reports` | Chỉ thấy Đơn hàng và Hồ sơ cá nhân; bị chuyển về `/admin` | Chưa chạy |
| PQ-07 | 2 | Menu của admin | Đăng nhập là admin | Xem menu trang quản trị | Thấy đủ 8 mục | Đạt (trình duyệt) |
| PQ-08 | 2 | Token hết hạn | Đã đăng nhập, token đã quá hạn | Mở một trang có gọi API | Tự đăng xuất, về trang Đăng nhập | Chưa chạy |
| PQ-09 | 7 | Khách xem đơn của khách khác | Khách A có một đơn; đăng nhập là khách B | Gọi `GET /api/orders/{id}` với mã đơn của khách A | Mã 404 | Chưa chạy |
| PQ-10 | 6 | Chưa đăng nhập mở trang Đặt dịch vụ | Chưa đăng nhập | Gõ địa chỉ `/booking` | Bị chuyển về trang Đăng nhập | Chưa chạy |

## 5. Bảng giá (BG)

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| BG-01 | 5 | Xem bảng giá khi chưa đăng nhập | Có dữ liệu thử | Mở trang chủ | Thấy 2 loại xe và 2 dịch vụ kèm đúng giá | Chưa chạy |
| BG-02 | 5 | Loại xe ngừng cung cấp không hiện | Admin đã tắt "Xe tải 2 tấn" | Mở trang chủ | Chỉ thấy "Xe tải 1 tấn" | Chưa chạy |

## 6. Đặt dịch vụ và đơn của khách (DH)

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| DH-01 | 6 | Giá ước tính đúng công thức | Đăng nhập là khách A | Nhập 12 km, tầng đi 3, tầng đến 0, chọn Xe tải 1 tấn và Đóng gói đồ đạc | Mở cửa 300.000, quãng đường 180.000, tầng 150.000, dịch vụ 200.000, tổng 830.000 | Chưa chạy |
| DH-02 | 6 | Giá ước tính khi không có phụ phí | Đăng nhập là khách A | Nhập 10 km, hai đầu tầng 0, Xe tải 1 tấn, không chọn dịch vụ | Tổng 450.000, phí tầng và phí dịch vụ bằng 0 | Chưa chạy |
| DH-03 | 6 | Đặt đơn thành công | Đăng nhập là khách A | Nhập đủ thông tin hợp lệ như DH-01, ngày chuyển ở tương lai, bấm Đặt | Tạo đơn Chờ xác nhận, Chưa thanh toán, giá ước tính 830.000; chuyển tới chi tiết đơn | Chưa chạy |
| DH-04 | 6 | Ngày chuyển ở quá khứ | Đăng nhập là khách A | Chọn ngày hôm qua, bấm Đặt | Báo lỗi, không tạo đơn | Chưa chạy |
| DH-05 | 6 | Số km không hợp lệ | Đăng nhập là khách A | Nhập 0 km hoặc số âm | Báo lỗi, không tạo đơn | Chưa chạy |
| DH-06 | 6 | Số tầng âm | Đăng nhập là khách A | Nhập tầng đi là -1 | Báo lỗi, không tạo đơn | Chưa chạy |
| DH-07 | 6 | Bỏ trống địa chỉ | Đăng nhập là khách A | Để trống địa chỉ đến, bấm Đặt | Báo lỗi ở trường địa chỉ, không tạo đơn | Chưa chạy |
| DH-08 | 6 | Chọn loại xe đã ngừng cung cấp | Admin đã tắt "Xe tải 2 tấn" | Gọi `POST /api/orders` với mã loại xe đó | Mã 400, không tạo đơn | Chưa chạy |
| DH-09 | 7 | Danh sách đơn của tôi | Khách A có 2 đơn, khách B có 1 đơn | Đăng nhập là khách A, mở Đơn của tôi | Thấy đúng 2 đơn của khách A, đơn mới nhất ở trên | Chưa chạy |
| DH-10 | 7 | Lọc đơn theo trạng thái | Khách A có đơn Chờ xác nhận và đơn Đã hủy | Chọn lọc Đã hủy | Chỉ thấy đơn Đã hủy | Chưa chạy |
| DH-11 | 7 | Xem chi tiết đơn đã xác nhận | Đơn của khách A đã được xác nhận | Mở chi tiết đơn | Thấy giá chốt, biển số xe, tên các nhân sự được phân công | Chưa chạy |
| DH-12 | 8 | Khách hủy đơn Chờ xác nhận | Khách A có đơn Chờ xác nhận | Mở đơn, bấm Hủy, nhập lý do, xác nhận | Đơn chuyển Đã hủy, hiện lý do | Chưa chạy |
| DH-13 | 8 | Khách hủy đơn Đã xác nhận | Đơn của khách A đã được xác nhận | Gọi `POST /api/orders/{id}/cancel` | Mã 409, đơn giữ trạng thái Đã xác nhận | Chưa chạy |
| DH-14 | 8 | Hủy đơn không nhập lý do | Khách A có đơn Chờ xác nhận | Bấm Hủy, để trống lý do | Báo lỗi, đơn không bị hủy | Chưa chạy |

## 7. Xử lý đơn (XL)

Điều kiện chung: đăng nhập là nhân viên, đã có dữ liệu thử.

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| XL-01 | 9 | Xem danh sách đơn | Có đơn của khách A và khách B | Mở Đơn hàng | Thấy đơn của mọi khách, mới nhất ở trên | Chưa chạy |
| XL-02 | 9 | Lọc đơn theo trạng thái | Có đơn ở nhiều trạng thái | Chọn lọc Chờ xác nhận | Chỉ thấy đơn Chờ xác nhận | Chưa chạy |
| XL-03 | 10 | Xác nhận đơn thành công | Có đơn Chờ xác nhận; xe và nhân sự Rảnh | Nhập giá chốt 850.000, chọn xe 29C-111.11, chọn Tài xế 1 và Bốc xếp 1, bấm Xác nhận | Đơn chuyển Đã xác nhận, lưu giá chốt, xe và đội | Chưa chạy |
| XL-04 | 10 | Xác nhận khi không chọn nhân sự | Có đơn Chờ xác nhận | Nhập giá, chọn xe, không chọn nhân sự | Báo lỗi, đơn giữ Chờ xác nhận | Chưa chạy |
| XL-05 | 10 | Xác nhận với giá chốt bằng 0 | Có đơn Chờ xác nhận | Nhập giá chốt 0 | Báo lỗi, đơn giữ Chờ xác nhận | Chưa chạy |
| XL-06 | 10 | Xác nhận với xe không Rảnh | Xe 29C-222.22 đang Bảo dưỡng | Gọi API xác nhận với mã xe đó | Mã 409 | Chưa chạy |
| XL-07 | 10 | Xác nhận với nhân sự không Rảnh | Bốc xếp 2 ở trạng thái Đã nghỉ | Gọi API xác nhận với mã nhân sự đó | Mã 409 | Chưa chạy |
| XL-08 | 10 | Xác nhận đơn không ở Chờ xác nhận | Đơn đã bị khách hủy | Gọi API xác nhận | Mã 409, đơn giữ Đã hủy | Chưa chạy |
| XL-09 | 11 | Bắt đầu thực hiện | Đơn Đã xác nhận ở XL-03 | Bấm Bắt đầu | Đơn chuyển Đang thực hiện; xe 29C-111.11, Tài xế 1, Bốc xếp 1 chuyển Bận | Chưa chạy |
| XL-10 | 11 | Bắt đầu khi xe đang Bận ở đơn khác | Hai đơn Đã xác nhận cùng dùng xe 29C-111.11; đơn thứ nhất Đang thực hiện | Bấm Bắt đầu ở đơn thứ hai | Mã 409, đơn thứ hai giữ Đã xác nhận | Chưa chạy |
| XL-11 | 11 | Bắt đầu đơn chưa xác nhận | Đơn Chờ xác nhận | Gọi API bắt đầu | Mã 409 | Chưa chạy |
| XL-12 | 11 | Hoàn thành đơn | Đơn Đang thực hiện ở XL-09 | Bấm Hoàn thành | Đơn chuyển Hoàn thành; xe và nhân sự về Rảnh | Chưa chạy |
| XL-13 | 11 | Hoàn thành đơn chưa bắt đầu | Đơn Đã xác nhận | Gọi API hoàn thành | Mã 409 | Chưa chạy |
| XL-14 | 12 | Ghi nhận đã cọc | Đơn Đã xác nhận, Chưa thanh toán | Chọn Đã cọc, bấm Lưu | Thanh toán chuyển Đã cọc; khách thấy trong chi tiết đơn | Chưa chạy |
| XL-15 | 12 | Ghi nhận đã thanh toán | Đơn Hoàn thành, Đã cọc | Chọn Đã thanh toán, bấm Lưu | Thanh toán chuyển Đã thanh toán | Chưa chạy |
| XL-16 | 12 | Cập nhật thanh toán đơn Đã hủy | Đơn Đã hủy | Gọi API thanh toán | Mã 409 | Chưa chạy |
| XL-17 | 13 | Nhân viên hủy đơn Chờ xác nhận | Đơn Chờ xác nhận | Bấm Hủy, nhập lý do | Đơn chuyển Đã hủy, lưu lý do | Chưa chạy |
| XL-18 | 13 | Nhân viên hủy đơn Đã xác nhận | Đơn Đã xác nhận | Bấm Hủy, nhập lý do | Đơn chuyển Đã hủy; xe và nhân sự vẫn Rảnh | Chưa chạy |
| XL-19 | 13 | Hủy đơn Đang thực hiện | Đơn Đang thực hiện | Gọi API hủy | Mã 409, đơn giữ Đang thực hiện | Chưa chạy |
| XL-20 | 10 | Danh sách xe rảnh | Một xe Rảnh, một xe Bảo dưỡng | Mở phần chọn xe của một đơn Xe tải 1 tấn | Chỉ thấy xe Rảnh thuộc loại Xe tải 1 tấn | Chưa chạy |
| XL-21 | 10 | Danh sách nhân sự rảnh | Một nhân sự Bận, một Đã nghỉ, một Rảnh | Mở phần chọn nhân sự | Chỉ thấy nhân sự Rảnh | Chưa chạy |

## 8. Quản trị (QT)

Điều kiện chung: đăng nhập là admin.

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| QT-01 | 14 | Thêm loại xe | | Nhập "Xe tải 1 tấn", 1.000 kg, 300.000, 15.000, bấm Lưu | Loại xe hiện trong danh sách và bảng giá | Chưa chạy |
| QT-02 | 14 | Thêm loại xe trùng tên | Đã có "Xe tải 1 tấn" | Thêm loại xe cùng tên | Báo lỗi trùng tên, không lưu | Chưa chạy |
| QT-03 | 14 | Sửa đơn giá không đổi giá đơn cũ | Có đơn giá ước tính 830.000 dùng Xe tải 1 tấn | Đổi giá mỗi km thành 20.000; mở lại đơn cũ | Bảng giá hiện giá mới; đơn cũ vẫn 830.000 | Chưa chạy |
| QT-04 | 14 | Ngừng cung cấp loại xe | | Tắt "Xe tải 2 tấn" | Còn trong danh sách của admin, không còn trong bảng giá | Chưa chạy |
| QT-05 | 14 | Xóa loại xe chưa dùng | Loại xe chưa có xe và chưa có đơn | Bấm Xóa, xác nhận | Loại xe biến mất khỏi danh sách | Chưa chạy |
| QT-06 | 14 | Xóa loại xe đã dùng | Loại xe đã có xe hoặc đơn | Bấm Xóa, xác nhận | Báo lỗi, loại xe vẫn còn | Chưa chạy |
| QT-07 | 15 | Thêm dịch vụ kèm theo | | Nhập "Đóng gói đồ đạc", 200.000, bấm Lưu | Dịch vụ hiện trong danh sách và trang Đặt dịch vụ | Chưa chạy |
| QT-08 | 15 | Xóa dịch vụ đã có đơn dùng | Có đơn chọn dịch vụ đó | Bấm Xóa, xác nhận | Báo lỗi, dịch vụ vẫn còn | Chưa chạy |
| QT-09 | 16 | Thêm xe | Có loại Xe tải 1 tấn | Nhập biển số 29C-111.11, chọn loại xe, bấm Lưu | Xe hiện trong danh sách, trạng thái Rảnh | Chưa chạy |
| QT-10 | 16 | Thêm xe trùng biển số | Đã có xe 29C-111.11 | Thêm xe cùng biển số | Báo lỗi trùng biển số, không lưu | Chưa chạy |
| QT-11 | 16 | Chuyển xe sang Bảo dưỡng | Xe đang Rảnh | Sửa trạng thái thành Bảo dưỡng | Xe không còn trong danh sách xe rảnh khi phân công | Chưa chạy |
| QT-12 | 16 | Xóa xe đã từng được phân công | Xe đã gắn với một đơn | Bấm Xóa, xác nhận | Báo lỗi, xe vẫn còn | Chưa chạy |
| QT-13 | 17 | Thêm nhân sự | | Nhập họ tên, SĐT, vị trí Tài xế, bấm Lưu | Nhân sự hiện trong danh sách, trạng thái Rảnh | Chưa chạy |
| QT-14 | 17 | Chuyển nhân sự sang Đã nghỉ | Nhân sự đang Rảnh | Sửa trạng thái thành Đã nghỉ | Nhân sự không còn trong danh sách phân công | Chưa chạy |
| QT-15 | 17 | Xóa nhân sự đã từng được phân công | Nhân sự đã gắn với một đơn | Bấm Xóa, xác nhận | Báo lỗi, nhân sự vẫn còn | Chưa chạy |
| QT-16 | 18 | Tạo tài khoản nhân viên | Email chưa được dùng | Nhập họ tên, email, SĐT, mật khẩu, bấm Lưu; đăng xuất; đăng nhập bằng tài khoản mới | Tài khoản hiện trong danh sách; đăng nhập vào được trang quản trị | Chưa chạy |
| QT-17 | 18 | Tạo tài khoản nhân viên trùng email | Email đã được dùng | Tạo tài khoản với email đó | Báo "Email đã được sử dụng" | Chưa chạy |
| QT-18 | 18 | Khóa tài khoản nhân viên | Nhân viên đang đăng nhập ở trình duyệt khác | Admin bấm Khóa; nhân viên tải lại trang | Nhân viên bị đưa về trang Đăng nhập và không đăng nhập lại được | Chưa chạy |
| QT-19 | 18 | Mở khóa tài khoản nhân viên | Tài khoản đang bị khóa | Admin bấm Mở khóa; nhân viên đăng nhập | Đăng nhập thành công | Chưa chạy |

## 9. Thống kê (TKE)

Điều kiện chung: đăng nhập là admin.

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| TKE-01 | 19 | Doanh thu theo tháng | Tháng 12/2026 có 2 đơn Hoàn thành, giá chốt 850.000 và 1.200.000 | Chọn năm 2026 | Tháng 12 hiện doanh thu 2.050.000 và 2 đơn; đủ 12 dòng | Chưa chạy |
| TKE-02 | 19 | Đơn chưa hoàn thành không tính doanh thu | Thêm 1 đơn Đã hủy và 1 đơn Đã xác nhận trong tháng 12/2026 | Chọn năm 2026 | Doanh thu tháng 12 vẫn là 2.050.000 | Chưa chạy |
| TKE-03 | 19 | Số đơn theo trạng thái | Có đơn ở cả 5 trạng thái | Chọn năm 2026 | Số đơn của từng trạng thái khớp với danh sách đơn | Chưa chạy |
| TKE-04 | 19 | Năm không có đơn | Năm 2025 không có đơn | Chọn năm 2025 | 12 tháng đều doanh thu 0; mọi trạng thái đều 0 đơn | Chưa chạy |

## 10. Luồng đầu cuối (E2E)

| Mã | CN | Tên test case | Điều kiện trước | Các bước | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|---|---|
| E2E-01 | 6, 10, 11, 12, 19 | Một đơn thành công từ đầu đến cuối | Có dữ liệu thử | Khách A đặt đơn → nhân viên xác nhận với giá 850.000, xe và đội → khách A xem đơn → nhân viên bấm Bắt đầu → bấm Hoàn thành → ghi nhận Đã thanh toán → admin xem thống kê | Đơn lần lượt qua Chờ xác nhận, Đã xác nhận, Đang thực hiện, Hoàn thành; xe và đội Bận rồi về Rảnh; doanh thu tháng tăng 850.000 | Chưa chạy |
| E2E-02 | 6, 8 | Khách đặt rồi hủy | Có dữ liệu thử | Khách A đặt đơn → hủy kèm lý do → nhân viên mở danh sách đơn | Đơn Đã hủy; nhân viên thấy đơn và lý do, không xác nhận được | Chưa chạy |
| E2E-03 | 10, 13 | Nhân viên hủy đơn đã xác nhận | Có dữ liệu thử | Khách A đặt đơn → nhân viên xác nhận → nhân viên hủy kèm lý do → khách A xem đơn | Đơn Đã hủy; khách thấy lý do; xe và đội vẫn Rảnh và phân công được cho đơn khác | Chưa chạy |
