# Hướng dẫn triển khai phần đơn hàng

Tài liệu gửi Đoàn Minh Dũng, tóm tắt những gì đã có trên nhánh `develop` (commit `e89d761`) và cách dùng lại khi làm phần đơn hàng và thanh toán (chức năng 6–13, 20, 21 theo sheet phân công).

## 1. Định dạng phản hồi chung

Mọi API, kể cả khi lỗi, trả về cùng một dạng `ApiResponse`:

```json
{ "status": 200, "message": "Thành công", "data": { ... } }
{ "status": 409, "message": "Chỉ hủy được đơn đang chờ xác nhận", "data": null }
```

### Backend

Dùng `common/ApiResponse.java`:

```java
@GetMapping("/{id}")
public ApiResponse<OrderResponse> detail(@PathVariable Long id) {
    return ApiResponse.ok(orderService.getForStaff(id));
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ApiResponse<OrderResponse> create(
        @Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
    return ApiResponse.created(orderService.create(authentication.getName(), request));
}

@DeleteMapping("/{id}/payments/{paymentId}")
public ApiResponse<Void> deletePayment(@PathVariable Long id, @PathVariable Long paymentId) {
    orderService.deletePayment(id, paymentId);
    return ApiResponse.message("Đã xóa lần thanh toán");
}
```

| Trường hợp | Cách làm |
|---|---|
| Thành công có dữ liệu | `ApiResponse.ok(data)` |
| Tạo mới | `@ResponseStatus(HttpStatus.CREATED)` và `ApiResponse.created(data)` |
| Thành công không có dữ liệu (xóa, đổi mật khẩu) | `ApiResponse.message("...")`, mã 200. Không dùng 204 |
| Lỗi nghiệp vụ | Ném `ApiException.badRequest(...)`, `notFound(...)`, `conflict(...)`. `GlobalExceptionHandler` tự đổi sang `ApiResponse` |
| Lỗi 401, 403 | `SecurityConfig` tự trả đúng định dạng, không cần làm gì |

`ErrorResponse` đã bị xóa.

### Frontend

Gọi API qua `core/api.service.ts`. Service này tự lấy trường `data` nên không cần tự `map`:

```ts
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);

  myOrders(status?: OrderStatus): Observable<Order[]> {
    return this.api.get<Order[]>('/api/orders/my', status ? { status } : undefined);
  }

  cancel(id: number, reason: string): Observable<Order> {
    return this.api.post<Order>(`/api/orders/${id}/cancel`, { reason });
  }
}
```

Lỗi vẫn hiển thị bằng `apiErrorMessage(error)` vì `message` nằm ở cấp ngoài cùng.

## 2. Service của module khác mà phần đơn hàng dùng được

Theo quy tắc trong `AGENTS.md`, module `order` chỉ gọi lớp `Service` của module khác, không gọi thẳng `Repository` của module đó.

| Cần gì | Gọi | Ghi chú |
|---|---|---|
| Loại xe theo id | `CatalogService.getVehicleType(id)` | Ném 404 nếu không có. Tự kiểm tra `isActive()` khi khách đặt đơn |
| Loại xe dạng `Optional` | `CatalogService.findVehicleType(id)` | Dùng khi muốn tự trả 400 |
| Dịch vụ kèm theo theo id | `CatalogService.getExtraService(id)` | Tự kiểm tra `isActive()` |
| Danh sách đang cung cấp | `CatalogService.listVehicleTypes(false)`, `listExtraServices(false)` | |
| Tài khoản đang đăng nhập | `UserService.getByEmail(authentication.getName())` | |
| Đổi entity sang DTO | `VehicleTypeResponse.from`, `ExtraServiceResponse.from`, `VehicleResponse.from`, `WorkerResponse.from`, `UserResponse.from` | Dùng lại khi dựng `OrderResponse` |

### Cần bổ sung vào `FleetService`

Phần này chưa có:

1. API 20 `GET /api/staff/vehicles/available?vehicleTypeId=` và API 21 `GET /api/staff/workers/available`. Hai API này phục vụ chức năng 10. Đặt controller trong package `fleet`, đường dẫn bắt đầu bằng `/api/staff/`.
2. Hàm để module `order` đổi trạng thái xe và nhân sự khi bắt đầu hoặc hoàn thành đơn, ví dụ `markBusy(vehicle, workers)` và `markAvailable(vehicle, workers)`.

Thêm truy vấn vào `VehicleRepository` và `WorkerRepository` (ví dụ `findByStatusOrderByIdAsc`). Không đổi trạng thái xe bằng repository từ module `order`.

## 3. Phần đang phụ thuộc vào entity `Order`

| Chỗ dùng | Phụ thuộc | Lưu ý |
|---|---|---|
| `report/ReportRepository` | Truy vấn `o.status`, `o.finalPrice`, `o.movingTime` | Đổi tên các trường này, hoặc đổi cách lưu giá chốt, thì thống kê hỏng. Báo lại để sửa cùng |
| Chặn xóa loại xe, dịch vụ, xe, nhân sự | Khóa ngoại `orders.vehicle_type_id`, `orders.vehicle_id`, bảng `order_services`, `order_workers` | Giữ nguyên các quan hệ này trong `Order` thì luật "không xóa mục đã có đơn dùng tới" tự đúng, trả 409 |
| Thống kê doanh thu | Tính theo `finalPrice` của đơn `COMPLETED` | Nếu thêm bảng thanh toán (API 41–44), doanh thu vẫn tính theo giá chốt, chưa theo các lần thanh toán |

## 4. Component dùng chung ở frontend

Nằm trong `frontend/src/app/shared/`. CSS của chúng nằm trong `frontend/src/styles.css`.

| Component | Cách dùng |
|---|---|
| `PageHeader` | `<app-page-header heading="Đơn hàng" subtitle="...">nút thao tác</app-page-header>` |
| `SectionCard` | `<app-section-card heading="Chi phí">...</app-section-card>` |
| `DataTable` | `<app-data-table><thead>...</thead><tbody>...</tbody></app-data-table>`. Dòng trống: `<tr><td colspan="n" class="table-empty">...</td></tr>` trong `@empty` |
| `StatusBadge` | `<app-status-badge kind="order" [value]="order.status" />`, `kind="payment"`. Đã có nhãn tiếng Việt và màu cho mọi trạng thái đơn và thanh toán. `badgeLabel('order', status)` trả nhãn dạng chuỗi |
| `Dialog` | `<app-dialog heading="Hủy đơn" confirmLabel="Hủy đơn" [danger]="true" [busy]="saving()" (confirmed)="..." (closed)="...">`. Phần thân không được có thẻ `<form>`, dùng `<div [formGroup]="form">` |
| `FormField` | `<app-form-field label="Lý do" fieldId="reason" [control]="form.controls.reason" error="Nhập lý do." suffix="đ" hint="...">` bọc quanh `input`, `select` hoặc `textarea` |
| Pipe `money` | `{{ order.finalPrice \| money }}` ra `850.000đ`; giá trị `null` hiện "Chưa có" |
| `PriceCard`, `StatCard`, `BarChart` | Dùng ở trang chủ và thống kê |

Tiêu đề của `PageHeader`, `SectionCard` và `Dialog` truyền qua thuộc tính `heading`, không dùng `title`.

### Component cần tạo thêm

`FilterTabs`, `OrderSteps`, `OrderInfo`, `CrewInfo`, `PriceSummary`, `CheckList`.

- Mẫu HTML và CSS nằm trong `documents/giao-dien/mockup/components.js` và `components.css`.
- Chép CSS của các khối đó vào `src/styles.css`.
- Mỗi khối thành một component trong `shared/`, vì màn 7 và màn 9 cùng dùng.

### Kiểu dữ liệu và định tuyến

- `core/models.ts` đã có `VehicleType`, `ExtraService`, `Vehicle`, `Worker`, `OrderStatus`, `PaymentStatus`, `POSITION_LABELS`. Cần thêm interface `Order` và `PriceEstimate`.
- Trong `app.routes.ts`, thay `ComingSoon` ở các dòng `orders`, `booking`, `my-orders` và giữ nguyên guard. Các route chi tiết `/admin/orders/:id` và `/my-orders/:id` cần thêm mới.

### Mẫu tham khảo

| Mẫu | File |
|---|---|
| Màn có bảng, hộp thoại thêm/sửa, hộp thoại xác nhận | `features/catalog/vehicle-types.ts` và `.html` |
| Gọi hai API cùng lúc bằng `forkJoin` | `features/reports/reports.ts` |
| Service gọi API | `core/catalog.service.ts`, `features/fleet/fleet.service.ts` |

## 5. Kiểm thử và chạy thử

- `mvn test` trên `develop` đang hỏng vì `AuthFlowTest` chưa được cập nhật theo `ApiResponse`. Bộ kiểm thử mới (`ApiTestSupport`, `CatalogApiTest`, `FleetApiTest`, `StaffApiTest`, `ReportApiTest`) đang ở máy Chính, chưa push.
- Khi viết kiểm thử MockMvc: dữ liệu đọc ở `$.data...`, thông báo lỗi đọc ở `$.message`.
- Tài khoản admin mặc định `admin@moving.local` / `Admin@123`, chỉ đúng với CSDL mới tạo.
- Chạy backend với profile `demo` để có dữ liệu mẫu: 14 đơn đủ các trạng thái, xe và nhân sự đủ trạng thái.

## 6. Quy ước của nhóm

- Code mới không viết comment.
- DTO dùng Java `record`; Lombok dùng cho entity và service.
- Mỗi API mới có kiểm thử MockMvc cho trường hợp thành công và các quy tắc nghiệp vụ trong `api.md`.
- Code thay đổi hành vi thì sửa tài liệu trong `documents/` cùng lúc.

## 7. Việc cần thống nhất

Tài liệu trong `documents/` vẫn ghi 19 chức năng, 40 API và để "Thanh toán online" ở mục ngoài phạm vi. Sheet phân công lại có 21 chức năng, 44 API, gồm xem lịch sử thanh toán (chức năng 20), thanh toán online qua VNPay (chức năng 21, API 42–44) và API 41 xóa lần thanh toán ghi nhầm (chức năng 12). Khi làm phần này cần cập nhật `chuc-nang.md`, `api.md` và `co-so-du-lieu.md` (bảng thanh toán mới) cho khớp sheet.
