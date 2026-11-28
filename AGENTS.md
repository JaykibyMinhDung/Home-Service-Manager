# Quy tắc cho agent làm việc trong dự án

Hệ thống quản lý dịch vụ chuyển nhà. Đồ án làm trong 1 tháng gồm cả tài liệu, nên ưu tiên đơn giản hơn đầy đủ.

## 1. Phạm vi

- Nguồn sự thật là thư mục `documents/`. Đọc file liên quan trước khi code một chức năng:
  - `chuc-nang.md`: 19 chức năng, 15 màn hình, phần ngoài phạm vi.
  - `luong-chinh.md`: 9 luồng nghiệp vụ và ngoại lệ.
  - `api.md`: 40 API, cấu trúc dữ liệu, quy tắc nghiệp vụ.
  - `co-so-du-lieu.md`: 8 bảng.
  - `test-case.md`: 88 test case và kết quả chạy.
  - `giao-dien.md`: ảnh mockup từng màn và bộ component chung.
- Không thêm chức năng, bảng, API, màn hình hay thư viện ngoài tài liệu khi chưa hỏi người dùng. Mục "Ngoài phạm vi" trong `chuc-nang.md` là những thứ đã quyết định không làm.
- Khi có hai cách làm, chọn cách ít code và ít khái niệm hơn. Không thêm lớp trừu tượng cho nhu cầu chưa có.
- Code thay đổi hành vi thì sửa tài liệu tương ứng trong cùng lượt làm việc. Tài liệu và code không được lệch nhau.

## 2. Cấu trúc

```
backend/    Spring Boot 4.1, Java 17, Maven, MySQL
frontend/   Angular 22, Bootstrap 5
documents/  Tài liệu phân tích thiết kế và mockup
```

### Backend: modular monolith

Mỗi module là một package trong `com.movingservice`, chứa đủ entity, repository, service, controller và DTO của nó.

| Module | Nội dung |
|---|---|
| `auth` | Đăng nhập, đăng ký, JWT, `SecurityConfig` |
| `user` | Tài khoản, hồ sơ, tài khoản nhân viên |
| `catalog` | Loại xe, dịch vụ kèm theo |
| `fleet` | Xe, đội vận chuyển |
| `order` | Đơn, tính giá, xử lý đơn, thanh toán |
| `report` | Thống kê |
| `common` | Lỗi và phần dùng chung |

- Module này dùng module khác qua lớp `Service` của nó, không gọi thẳng `Repository` của module khác.
- Entity được phép liên kết JPA sang entity của module khác (ví dụ `Order` tới `User`).
- Không tạo module mới khi chưa hỏi.

### Frontend

```
src/app/core/       Phiên đăng nhập, interceptor, guard, kiểu dữ liệu dùng chung
src/app/shared/     Component dùng chung cho nhiều màn
src/app/layouts/    Bố cục khách hàng và bố cục quản trị
src/app/features/   Mỗi nhóm màn hình một thư mục
```

## 3. Quy ước backend

- Controller nhận và trả `record` DTO, không trả entity. DTO của tài khoản không bao giờ chứa mật khẩu.
- Kiểm tra dữ liệu vào bằng `@Valid` và annotation trên record, thông báo lỗi viết bằng tiếng Việt.
- Mọi API trả về `ApiResponse<T>` (`common`) dạng `{ "status", "message", "data" }`: thành công dùng `ApiResponse.ok(data)`, `created(data)` hoặc `message("...")`; API xóa trả 200 với `data` là `null`, không dùng 204.
- Lỗi nghiệp vụ ném `ApiException` (`badRequest`, `notFound`, `conflict`); `GlobalExceptionHandler` và `SecurityConfig` đổi mọi lỗi thành `ApiResponse` với `data` là `null`.
- Phân quyền theo đường dẫn, khai báo một chỗ trong `SecurityConfig`: `/api/admin/**` cho admin, `/api/staff/**` cho nhân viên và admin, `/api/orders/**` cho khách. API mới phải nằm đúng tiền tố, không dùng `@PreAuthorize` rải rác.
- Kiểm tra quyền trên dữ liệu (khách chỉ thấy đơn của mình) làm trong service; đơn không thuộc về người gọi thì trả 404.
- Thao tác ghi đặt trong `@Transactional`.
- Cột enum lưu chuỗi: `@Enumerated(EnumType.STRING)` kèm `@JdbcTypeCode(SqlTypes.VARCHAR)`.
- Tiền dùng `BigDecimal`, cột `precision = 12, scale = 0`, đơn vị VND.
- Bảng do Hibernate tạo từ entity (`ddl-auto=update`), không viết script SQL. Đổi entity thì sửa `co-so-du-lieu.md`.
- Giá của đơn luôn tính ở server; không tin giá do giao diện gửi lên.
- Đổi trạng thái đơn chỉ theo các bước trong `luong-chinh.md`; sai trạng thái thì trả 409.

## 4. Quy ước frontend

- Component standalone, không có hậu tố `.component` trong tên file (`login.ts`, `login.html`), tên lớp không có hậu tố `Component`.
- Ứng dụng chạy zoneless: trạng thái hiển thị giữ trong `signal`, không dựa vào zone.js.
- Template dùng `@if`, `@for`; form dùng Reactive Forms.
- Gọi API qua service, đường dẫn tương đối `/api/...`. Service dùng `ApiService` (`core/api.service.ts`) để lấy sẵn trường `data` của `ApiResponse`. Token do `authInterceptor` gắn, không tự gắn ở từng lời gọi.
- Lỗi API hiển thị bằng `apiErrorMessage(error)`.
- Giao diện dùng lớp CSS của Bootstrap 5, không dùng JavaScript của Bootstrap, không thêm thư viện giao diện khác. Màu và kiểu chung nằm trong `src/styles.css`.
- Màn hình mới phải dùng component trong `shared/` và giống ảnh mockup trong `documents/giao-dien/`. Cần một mẫu giao diện ở từ hai màn trở lên thì tách thành component trong `shared/`, không sao chép HTML.
- Màn hình mới gắn vào `app.routes.ts` bằng cách thay `ComingSoon` ở dòng có sẵn, giữ nguyên guard theo vai trò.

## 5. Ngôn ngữ

- Chữ trên giao diện, thông báo lỗi, tài liệu và chú thích trong code: tiếng Việt có dấu.
- Tên lớp, hàm, biến, bảng, cột, đường dẫn API: tiếng Anh.
- Giá trị enum giữ tiếng Anh (`PENDING`); đổi sang tiếng Việt ở giao diện.

## 6. Lệnh

Chạy từ thư mục gốc của dự án.

| Việc | Lệnh |
|---|---|
| Chạy backend (cổng 8090) | `mvn -f backend/pom.xml spring-boot:run` |
| Kiểm thử backend | `mvn -f backend/pom.xml test` |
| Chạy frontend (cổng 4200) | `npm --prefix frontend start` |
| Build frontend | `npm --prefix frontend run build` |

- Backend dùng cổng 8090 vì cổng 8080 và 8081 trên máy này đã có chương trình khác dùng. Không đổi lại.
- Kiểm thử backend chạy trên H2 trong bộ nhớ, không cần MySQL.

## 7. Kiểm thử và báo cáo

- Mỗi API mới có kiểm thử MockMvc cho trường hợp thành công và các quy tắc nghiệp vụ của nó trong `api.md`.
- Trước khi báo xong: `mvn test` phải qua và `ng build` phải thành công. Màn hình mới thì mở thử trong trình duyệt.
- Chạy xong test case nào thì cập nhật cột "Kết quả" và bảng tổng hợp trong `test-case.md`.
- Báo cáo đúng những gì đã kiểm tra. Phần chưa chạy hoặc chưa thử phải nói rõ là chưa.

## 8. Không được làm

- Không ghi mật khẩu MySQL thật, khóa hay token thật vào file được git theo dõi. Mật khẩu MySQL truyền qua biến môi trường `DB_PASSWORD`.
- Không commit, push, đổi nhánh hay xóa dữ liệu khi người dùng chưa yêu cầu.
- Không sửa `backend/target/`, `frontend/dist/`, `frontend/node_modules/`.
- Không nâng phiên bản Spring Boot, Angular hay thư viện khi chưa hỏi.
- Không bỏ qua hoặc xóa kiểm thử đang hỏng để cho qua; tìm nguyên nhân và sửa.
