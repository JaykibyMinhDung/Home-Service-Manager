# Thiết kế API

Tổng cộng 40 API, kiểu REST, dữ liệu gửi và nhận là JSON.

## 1. Quy ước chung

| Mục | Quy ước |
|---|---|
| Địa chỉ gốc | `http://localhost:8090/api` |
| Xác thực | JWT. Sau khi đăng nhập, gửi kèm header `Authorization: Bearer <token>` ở mọi API cần đăng nhập |
| Ngày giờ | Chuỗi ISO, ví dụ `2026-12-05T08:30:00` |
| Tiền | Số nguyên, đơn vị VND |
| Lỗi | Trả về `{ "message": "Nội dung lỗi" }` kèm mã HTTP tương ứng |

### Quyền truy cập

| Ký hiệu | Ai gọi được |
|---|---|
| Công khai | Không cần đăng nhập |
| Đã đăng nhập | Mọi tài khoản đã đăng nhập |
| Khách | Tài khoản `CUSTOMER` |
| Nhân viên | Tài khoản `STAFF` và `ADMIN` |
| Admin | Chỉ tài khoản `ADMIN` |

### Mã HTTP

| Mã | Khi nào |
|---|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 204 | Thành công, không có dữ liệu trả về |
| 400 | Dữ liệu gửi lên không hợp lệ |
| 401 | Chưa đăng nhập, token sai hoặc hết hạn |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy |
| 409 | Vi phạm quy tắc nghiệp vụ, ví dụ hủy đơn đang thực hiện |

## 2. Danh sách API

Cột "CN" là số thứ tự chức năng trong [chuc-nang.md](chuc-nang.md).

### 2.1. Tài khoản (5 API)

Module `auth` (API 1, 2) và `user` (API 3, 4, 5).

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 1 | POST | `/auth/register` | Công khai | `fullName`, `email`, `phone`, `password` | 201, `token` và `user`. Tài khoản tạo ra có vai trò `CUSTOMER` | 1 |
| 2 | POST | `/auth/login` | Công khai | `email`, `password` | 200, `token` và `user` | 2 |
| 3 | GET | `/users/me` | Đã đăng nhập | Không | 200, `User` đang đăng nhập | 4 |
| 4 | PUT | `/users/me` | Đã đăng nhập | `fullName`, `phone` | 200, `User` sau khi sửa | 4 |
| 5 | PUT | `/users/me/password` | Đã đăng nhập | `oldPassword`, `newPassword` | 204 | 4 |

Đăng xuất (chức năng 3) không cần API: giao diện tự xóa token đang lưu.

### 2.2. Bảng giá công khai (2 API)

Module `catalog`.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 6 | GET | `/vehicle-types` | Công khai | Tham số `includeInactive` (chỉ Admin dùng được) | 200, danh sách `VehicleType` đang cung cấp | 5, 14 |
| 7 | GET | `/extra-services` | Công khai | Tham số `includeInactive` (chỉ Admin dùng được) | 200, danh sách `ExtraService` đang cung cấp | 5, 15 |

### 2.3. Đơn của khách (5 API)

Module `order`. Khách chỉ xem và hủy được đơn của chính mình.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 8 | POST | `/orders/estimate` | Khách | `distanceKm`, `pickupFloor`, `deliveryFloor`, `vehicleTypeId`, `extraServiceIds` | 200, `PriceEstimate` | 6 |
| 9 | POST | `/orders` | Khách | `pickupAddress`, `deliveryAddress`, `movingTime`, `distanceKm`, `pickupFloor`, `deliveryFloor`, `vehicleTypeId`, `extraServiceIds`, `note` | 201, `Order` ở trạng thái `PENDING` | 6 |
| 10 | GET | `/orders/my` | Khách | Tham số `status` (không bắt buộc) | 200, danh sách `Order` của khách, mới nhất trước | 7 |
| 11 | GET | `/orders/{id}` | Khách | Không | 200, `Order` | 7 |
| 12 | POST | `/orders/{id}/cancel` | Khách | `reason` | 200, `Order` ở trạng thái `CANCELLED`. Chỉ hủy được đơn `PENDING` | 8 |

### 2.4. Xử lý đơn (9 API)

Module `order` (API 13 đến 19) và `fleet` (API 20, 21).

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 13 | GET | `/staff/orders` | Nhân viên | Tham số `status` (không bắt buộc) | 200, danh sách `Order`, mới nhất trước | 9 |
| 14 | GET | `/staff/orders/{id}` | Nhân viên | Không | 200, `Order` | 9 |
| 15 | POST | `/staff/orders/{id}/confirm` | Nhân viên | `finalPrice`, `vehicleId`, `workerIds` | 200, `Order` chuyển `PENDING` → `CONFIRMED` | 10 |
| 16 | POST | `/staff/orders/{id}/start` | Nhân viên | Không | 200, `Order` chuyển `CONFIRMED` → `IN_PROGRESS`. Xe và nhân sự chuyển `BUSY` | 11 |
| 17 | POST | `/staff/orders/{id}/complete` | Nhân viên | Không | 200, `Order` chuyển `IN_PROGRESS` → `COMPLETED`. Xe và nhân sự về `AVAILABLE` | 11 |
| 18 | POST | `/staff/orders/{id}/cancel` | Nhân viên | `reason` | 200, `Order` ở trạng thái `CANCELLED`. Chỉ hủy được đơn `PENDING` hoặc `CONFIRMED` | 13 |
| 19 | PUT | `/staff/orders/{id}/payment` | Nhân viên | `paymentStatus` | 200, `Order` sau khi cập nhật | 12 |
| 20 | GET | `/staff/vehicles/available` | Nhân viên | Tham số `vehicleTypeId` (không bắt buộc) | 200, danh sách `Vehicle` đang `AVAILABLE` | 10 |
| 21 | GET | `/staff/workers/available` | Nhân viên | Không | 200, danh sách `Worker` đang `AVAILABLE` | 10 |

### 2.5. Quản trị loại xe và dịch vụ kèm theo (6 API)

Module `catalog`. Danh sách dùng lại API 6 và 7 với `includeInactive=true`.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 22 | POST | `/admin/vehicle-types` | Admin | `name`, `capacityKg`, `basePrice`, `pricePerKm` | 201, `VehicleType` | 14 |
| 23 | PUT | `/admin/vehicle-types/{id}` | Admin | `name`, `capacityKg`, `basePrice`, `pricePerKm`, `active` | 200, `VehicleType` | 14 |
| 24 | DELETE | `/admin/vehicle-types/{id}` | Admin | Không | 204. Trả 409 nếu loại xe đã có xe hoặc đơn dùng tới | 14 |
| 25 | POST | `/admin/extra-services` | Admin | `name`, `description`, `price` | 201, `ExtraService` | 15 |
| 26 | PUT | `/admin/extra-services/{id}` | Admin | `name`, `description`, `price`, `active` | 200, `ExtraService` | 15 |
| 27 | DELETE | `/admin/extra-services/{id}` | Admin | Không | 204. Trả 409 nếu dịch vụ đã có đơn dùng tới | 15 |

### 2.6. Quản trị xe và đội vận chuyển (8 API)

Module `fleet`.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 28 | GET | `/admin/vehicles` | Admin | Không | 200, danh sách `Vehicle` | 16 |
| 29 | POST | `/admin/vehicles` | Admin | `licensePlate`, `vehicleTypeId` | 201, `Vehicle` ở trạng thái `AVAILABLE` | 16 |
| 30 | PUT | `/admin/vehicles/{id}` | Admin | `licensePlate`, `vehicleTypeId`, `status` | 200, `Vehicle` | 16 |
| 31 | DELETE | `/admin/vehicles/{id}` | Admin | Không | 204. Trả 409 nếu xe đã từng được phân công | 16 |
| 32 | GET | `/admin/workers` | Admin | Không | 200, danh sách `Worker` | 17 |
| 33 | POST | `/admin/workers` | Admin | `fullName`, `phone`, `position` | 201, `Worker` ở trạng thái `AVAILABLE` | 17 |
| 34 | PUT | `/admin/workers/{id}` | Admin | `fullName`, `phone`, `position`, `status` | 200, `Worker` | 17 |
| 35 | DELETE | `/admin/workers/{id}` | Admin | Không | 204. Trả 409 nếu nhân sự đã từng được phân công | 17 |

### 2.7. Quản trị tài khoản nhân viên (3 API)

Module `user`.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 36 | GET | `/admin/staff` | Admin | Không | 200, danh sách `User` có vai trò `STAFF` | 18 |
| 37 | POST | `/admin/staff` | Admin | `fullName`, `email`, `phone`, `password` | 201, `User` có vai trò `STAFF` | 18 |
| 38 | PUT | `/admin/staff/{id}/active` | Admin | `active` | 200, `User` sau khi khóa hoặc mở khóa | 18 |

### 2.8. Thống kê (2 API)

Module `report`. Doanh thu chỉ tính đơn `COMPLETED`, theo giá chốt và theo tháng của ngày chuyển.

| # | Phương thức | Đường dẫn | Quyền | Dữ liệu gửi | Kết quả | CN |
|---|---|---|---|---|---|---|
| 39 | GET | `/admin/reports/revenue` | Admin | Tham số `year` | 200, 12 dòng `month`, `revenue`, `orderCount` | 19 |
| 40 | GET | `/admin/reports/orders-by-status` | Admin | Tham số `year` | 200, mỗi trạng thái một dòng `status`, `count` | 19 |

## 3. Cấu trúc dữ liệu trả về

### `User`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã tài khoản |
| `fullName` | chuỗi | Họ tên |
| `email` | chuỗi | Email |
| `phone` | chuỗi | Số điện thoại |
| `role` | chuỗi | `CUSTOMER`, `STAFF` hoặc `ADMIN` |
| `active` | đúng/sai | Tài khoản còn hoạt động hay đã khóa |

Mật khẩu không bao giờ được trả về.

### `VehicleType`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã loại xe |
| `name` | chuỗi | Tên loại xe |
| `capacityKg` | số | Tải trọng (kg) |
| `basePrice` | số | Giá mở cửa |
| `pricePerKm` | số | Giá mỗi km |
| `active` | đúng/sai | Còn cung cấp hay không |

### `ExtraService`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã dịch vụ |
| `name` | chuỗi | Tên dịch vụ |
| `description` | chuỗi | Mô tả |
| `price` | số | Giá |
| `active` | đúng/sai | Còn cung cấp hay không |

### `Vehicle`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã xe |
| `licensePlate` | chuỗi | Biển số |
| `vehicleType` | `VehicleType` | Loại xe |
| `status` | chuỗi | `AVAILABLE`, `BUSY` hoặc `MAINTENANCE` |

### `Worker`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã nhân sự |
| `fullName` | chuỗi | Họ tên |
| `phone` | chuỗi | Số điện thoại |
| `position` | chuỗi | `DRIVER` hoặc `PORTER` |
| `status` | chuỗi | `AVAILABLE`, `BUSY` hoặc `INACTIVE` |

### `PriceEstimate`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `basePrice` | số | Giá mở cửa của loại xe |
| `distanceFee` | số | Số km × giá mỗi km |
| `floorFee` | số | (Số tầng nơi đi + số tầng nơi đến) × phí mỗi tầng |
| `servicesFee` | số | Tổng giá dịch vụ kèm theo |
| `total` | số | Tổng giá ước tính |

### `Order`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Mã đơn |
| `customer` | `User` | Khách đặt đơn |
| `pickupAddress` | chuỗi | Địa chỉ nơi đi |
| `deliveryAddress` | chuỗi | Địa chỉ nơi đến |
| `movingTime` | ngày giờ | Ngày giờ chuyển |
| `distanceKm` | số | Quãng đường (km) |
| `pickupFloor` | số | Số tầng nơi đi |
| `deliveryFloor` | số | Số tầng nơi đến |
| `vehicleType` | `VehicleType` | Loại xe khách chọn |
| `extraServices` | danh sách `ExtraService` | Dịch vụ kèm theo |
| `note` | chuỗi | Ghi chú của khách |
| `estimatedPrice` | số | Giá ước tính |
| `finalPrice` | số | Giá chốt, trống khi đơn chưa xác nhận |
| `status` | chuỗi | Trạng thái đơn |
| `paymentStatus` | chuỗi | Trạng thái thanh toán |
| `vehicle` | `Vehicle` | Xe được phân công, trống khi đơn chưa xác nhận |
| `workers` | danh sách `Worker` | Nhân sự được phân công |
| `cancelReason` | chuỗi | Lý do hủy |
| `createdAt` | ngày giờ | Thời điểm đặt |

## 4. Kiểm tra dữ liệu và quy tắc nghiệp vụ

| # | API | Quy tắc | Mã lỗi khi vi phạm |
|---|---|---|---|
| 1 | 1, 37 | Email đúng định dạng và chưa được dùng | 400, 409 |
| 2 | 1, 5, 37 | Mật khẩu từ 6 ký tự | 400 |
| 3 | 2 | Sai email hoặc mật khẩu, hoặc tài khoản bị khóa | 401 |
| 4 | 5 | Mật khẩu cũ phải đúng | 400 |
| 5 | 8, 9 | `distanceKm` lớn hơn 0; số tầng từ 0 trở lên; loại xe và dịch vụ phải đang cung cấp | 400 |
| 6 | 9 | `movingTime` phải ở tương lai | 400 |
| 7 | 11, 12 | Đơn phải thuộc về khách đang đăng nhập | 404 |
| 8 | 12 | Đơn phải đang `PENDING` | 409 |
| 9 | 15 | Đơn phải đang `PENDING`; `finalPrice` lớn hơn 0; xe phải `AVAILABLE`; phải chọn ít nhất một nhân sự và tất cả đang `AVAILABLE` | 400, 409 |
| 10 | 16 | Đơn phải đang `CONFIRMED`; xe và nhân sự của đơn không được đang `BUSY` ở đơn khác | 409 |
| 11 | 17 | Đơn phải đang `IN_PROGRESS` | 409 |
| 12 | 18 | Đơn phải đang `PENDING` hoặc `CONFIRMED` | 409 |
| 13 | 19 | Không cập nhật thanh toán cho đơn `CANCELLED` | 409 |
| 14 | 24, 27, 31, 35 | Không xóa được mục đã có đơn dùng tới | 409 |
| 15 | 12, 18 | `reason` không được để trống | 400 |
| 16 | 22, 23, 25, 26 | Tên loại xe và tên dịch vụ không được trùng; giá từ 0 trở lên | 409, 400 |
| 17 | 29, 30 | Biển số không được trùng | 409 |

## 5. Ví dụ

### Đăng nhập (API 2)

Gửi:

```json
{
  "email": "khach@example.com",
  "password": "matkhau123"
}
```

Nhận:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 5,
    "fullName": "Nguyễn Văn A",
    "email": "khach@example.com",
    "phone": "0901234567",
    "role": "CUSTOMER",
    "active": true
  }
}
```

### Tính giá ước tính (API 8)

Gửi:

```json
{
  "distanceKm": 12,
  "pickupFloor": 3,
  "deliveryFloor": 0,
  "vehicleTypeId": 1,
  "extraServiceIds": [2]
}
```

Nhận, với loại xe có giá mở cửa 300.000đ và 15.000đ mỗi km, phí mỗi tầng 50.000đ, dịch vụ kèm theo giá 200.000đ:

```json
{
  "basePrice": 300000,
  "distanceFee": 180000,
  "floorFee": 150000,
  "servicesFee": 200000,
  "total": 830000
}
```

### Xác nhận đơn (API 15)

Gửi:

```json
{
  "finalPrice": 850000,
  "vehicleId": 4,
  "workerIds": [1, 6, 7]
}
```

Nhận: `Order` với `status` là `CONFIRMED`, kèm `finalPrice`, `vehicle` và `workers` vừa chọn.

### Lỗi (mã 409)

```json
{
  "message": "Chỉ hủy được đơn đang chờ xác nhận"
}
```
