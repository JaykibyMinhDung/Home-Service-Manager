/*
 * Định nghĩa từng màn hình của mockup. Mỗi màn chỉ ghép các component trong components.js
 * với dữ liệu mẫu; không màn nào tự viết kiểu riêng.
 * height là chiều cao ảnh khi xuất PNG ở chiều rộng 1280px.
 */
(function () {
  const UI = window.UI;
  const money = UI.money;

  /* ---------- Dữ liệu mẫu ---------- */

  const AN = { name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@example.com' };
  const BINH = { name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@example.com' };
  const CUONG = { name: 'Phạm Quốc Cường', phone: '0987654321', email: 'cuong.pham@example.com' };

  const ESTIMATE_LINES = [
    ['Giá mở cửa', 'Xe tải 1 tấn', 300000],
    ['Quãng đường', '12 km × 15.000đ', 180000],
    ['Phụ phí tầng', '3 tầng × 50.000đ', 150000],
    ['Dịch vụ kèm theo', 'Đóng gói đồ đạc', 200000],
  ];

  const baseOrder = {
    code: 'DH0012',
    customer: AN,
    pickup: 'Số 12 ngõ 80 Trần Phú, Hà Đông, Hà Nội',
    pickupFloor: 3,
    delivery: 'Tòa CT2 khu đô thị Văn Quán, Hà Đông, Hà Nội',
    deliveryFloor: 0,
    time: '08:00 ngày 05/12/2026',
    km: 12,
    vehicleType: 'Xe tải 1 tấn',
    services: ['Đóng gói đồ đạc'],
    note: 'Có một tủ lạnh và một máy giặt, cầu thang hẹp.',
    estimated: 830000,
  };

  const pendingOrder = { ...baseOrder, status: 'PENDING', payment: 'UNPAID' };

  const confirmedOrder = {
    ...baseOrder,
    status: 'CONFIRMED',
    payment: 'DEPOSITED',
    final: 850000,
    vehicle: '29C-111.11 (Xe tải 1 tấn)',
    workers: [
      { name: 'Đỗ Văn Hùng', position: 'Tài xế' },
      { name: 'Lý Minh Tuấn', position: 'Bốc xếp' },
      { name: 'Vũ Đức Long', position: 'Bốc xếp' },
    ],
  };

  const route = (from, to) => `${from}<div class="cell-sub">đến ${to}</div>`;
  const when = (date, time) => `${date}<div class="cell-sub">${time}</div>`;
  const person = (customer) => `${customer.name}<div class="cell-sub">${customer.phone}</div>`;

  /* ---------- Khối dùng lại giữa các màn ---------- */

  function orderHeader(order, actions = '') {
    return UI.pageHeader({
      title: `Đơn ${order.code}`,
      subtitle: `${UI.statusBadge('order', order.status)} ${UI.statusBadge('payment', order.payment)}`,
      actions,
    });
  }

  function costCard(order) {
    const finalLine =
      order.final != null
        ? `<div class="price-summary"><div class="price-total"><span>Giá chốt</span><span class="amount">${money(order.final)}</span></div></div>`
        : '<p class="text-secondary small mb-0 mt-3">Giá chốt sẽ có sau khi nhân viên xác nhận đơn.</p>';
    return UI.sectionCard({
      title: 'Chi phí',
      body: UI.priceSummary({ lines: ESTIMATE_LINES, total: order.estimated }) + finalLine,
    });
  }

  function customerOrderDetail(order, actions, note) {
    return UI.customerLayout({
      active: 'Đơn của tôi',
      content: `
        ${orderHeader(order, actions)}
        ${UI.orderSteps(order.status)}
        ${note ? UI.alertBox('info', note) : ''}
        <div class="row gx-3 gy-0">
          <div class="col-lg-7">
            ${UI.sectionCard({ title: 'Thông tin chuyển nhà', body: UI.orderInfo(order) })}
            ${UI.sectionCard({ title: 'Xe và đội vận chuyển', body: UI.crewInfo(order) })}
          </div>
          <div class="col-lg-5">${costCard(order)}</div>
        </div>`,
    });
  }

  function staffOrderDetail(order, actionPanel) {
    return UI.adminLayout({
      active: 'Đơn hàng',
      role: 'STAFF',
      content: `
        ${orderHeader(order, UI.button('Quay lại danh sách', 'outline-secondary'))}
        ${UI.orderSteps(order.status)}
        <div class="row gx-3 gy-0">
          <div class="col-xl-7">
            ${UI.sectionCard({ title: 'Thông tin đơn', body: UI.orderInfo(order, { showCustomer: true }) })}
            ${costCard(order)}
          </div>
          <div class="col-xl-5">${actionPanel}</div>
        </div>`,
    });
  }

  function crudScreen({ active, title, subtitle, addLabel, columns, rows }) {
    return UI.adminLayout({
      active,
      content: `
        ${UI.pageHeader({ title, subtitle, actions: UI.button(addLabel) })}
        ${UI.dataTable({ columns, rows })}`,
    });
  }

  const vehicleTypeScreen = () =>
    crudScreen({
      active: 'Loại xe và đơn giá',
      title: 'Loại xe và đơn giá',
      subtitle: 'Giá ước tính của đơn tính theo giá mở cửa và giá mỗi km của loại xe.',
      addLabel: 'Thêm loại xe',
      columns: [
        { label: 'Tên loại xe' },
        { label: 'Tải trọng', align: 'end' },
        { label: 'Giá mở cửa', align: 'end' },
        { label: 'Giá mỗi km', align: 'end' },
        { label: 'Trạng thái' },
        { label: '', align: 'end' },
      ],
      rows: [
        ['Xe tải 500 kg', '500 kg', money(200000), money(12000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
        ['Xe tải 1 tấn', '1.000 kg', money(300000), money(15000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
        ['Xe tải 2 tấn', '2.000 kg', money(500000), money(20000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
        ['Xe tải 3,5 tấn', '3.500 kg', money(800000), money(25000), UI.statusBadge('offer', false), UI.rowActions(['Sửa', 'Xóa'])],
      ],
    });

  /* ---------- Các màn hình ---------- */

  window.SCREENS = {
    '00-component-chung': {
      title: 'Bộ component dùng chung',
      height: 1900,
      render: () => `
        <div class="sheet">
          <h1 class="page-title">Bộ component dùng chung</h1>
          <p class="text-secondary">Mọi màn hình đều ghép từ các component dưới đây. Tên bên cạnh là tên component trong <code>frontend/src/app/shared</code>.</p>

          <h2>Tiêu đề trang <span class="sheet-name">PageHeader</span></h2>
          ${UI.pageHeader({ title: 'Loại xe và đơn giá', subtitle: 'Dòng mô tả ngắn của trang.', actions: UI.button('Thêm loại xe') })}

          <h2>Nhãn trạng thái <span class="sheet-name">StatusBadge</span></h2>
          <p class="mb-2">Đơn: ${['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => UI.statusBadge('order', s)).join(' ')}</p>
          <p class="mb-2">Thanh toán: ${['UNPAID', 'DEPOSITED', 'PAID'].map((s) => UI.statusBadge('payment', s)).join(' ')}</p>
          <p class="mb-0">Xe, nhân sự, danh mục, tài khoản: ${['AVAILABLE', 'BUSY', 'MAINTENANCE', 'INACTIVE'].map((s) => UI.statusBadge('resource', s)).join(' ')}
            ${UI.statusBadge('offer', true)} ${UI.statusBadge('offer', false)} ${UI.statusBadge('account', true)} ${UI.statusBadge('account', false)}</p>

          <h2>Lọc theo trạng thái <span class="sheet-name">FilterTabs</span></h2>
          ${UI.filterTabs([['Tất cả', 24], ['Chờ xác nhận', 3], ['Đã xác nhận', 5], ['Hoàn thành', 14]], 'Chờ xác nhận')}

          <h2>Bảng dữ liệu <span class="sheet-name">DataTable</span></h2>
          ${UI.dataTable({
            columns: [{ label: 'Biển số' }, { label: 'Loại xe' }, { label: 'Trạng thái' }, { label: '', align: 'end' }],
            rows: [
              ['29C-111.11', 'Xe tải 1 tấn', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
              ['29C-222.22', 'Xe tải 1 tấn', UI.statusBadge('resource', 'BUSY'), UI.rowActions(['Sửa', 'Xóa'])],
            ],
          })}

          <div class="row g-4">
            <div class="col-6">
              <h2>Ô nhập liệu <span class="sheet-name">FormField</span></h2>
              ${UI.formField({ label: 'Họ tên', value: 'Nguyễn Văn An' })}
              ${UI.formField({ label: 'Số điện thoại', value: '09012', error: 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.' })}
              ${UI.formField({ label: 'Giá chốt', value: '850.000', suffix: 'đ', hint: 'Giá ước tính của đơn là 830.000đ.' })}
              ${UI.formField({ label: 'Loại xe', value: 'Xe tải 1 tấn', options: ['Xe tải 500 kg', 'Xe tải 1 tấn'] })}

              <h2>Chọn nhiều mục <span class="sheet-name">CheckList</span></h2>
              ${UI.checkList([
                { label: 'Đóng gói đồ đạc', note: money(200000), checked: true },
                { label: 'Tháo lắp nội thất', note: money(300000) },
              ])}

              <h2>Thông báo <span class="sheet-name">Alert</span></h2>
              ${UI.alertBox('success', 'Đã lưu hồ sơ.')}
              ${UI.alertBox('danger', 'Email hoặc mật khẩu không đúng')}
            </div>
            <div class="col-6">
              <h2>Bảng tính giá <span class="sheet-name">PriceSummary</span></h2>
              ${UI.sectionCard({ body: UI.priceSummary({ lines: ESTIMATE_LINES, total: 830000 }) })}

              <h2>Tiến độ đơn <span class="sheet-name">OrderSteps</span></h2>
              ${UI.orderSteps('CONFIRMED')}

              <h2>Ô số liệu <span class="sheet-name">StatCard</span></h2>
              <div class="row gx-3 gy-0">
                <div class="col-6">${UI.statCard({ label: 'Doanh thu năm', value: '338.900.000đ', hint: 'Đơn đã hoàn thành' })}</div>
                <div class="col-6">${UI.statCard({ label: 'Đơn hoàn thành', value: '262', hint: 'Trên 303 đơn' })}</div>
              </div>

              <h2>Hộp thoại <span class="sheet-name">Dialog</span></h2>
              <div class="sheet-dialog">
                ${UI.dialog({ title: 'Xóa xe 29C-222.22?', body: '<p class="mb-0">Xe sẽ bị xóa khỏi danh sách. Thao tác này không hoàn tác được.</p>', confirmLabel: 'Xóa xe', danger: true })}
              </div>
            </div>
          </div>

          <h2>Thông tin đơn <span class="sheet-name">OrderInfo, CrewInfo</span></h2>
          <div class="row gx-3 gy-0">
            <div class="col-7">${UI.sectionCard({ title: 'Thông tin chuyển nhà', body: UI.orderInfo(confirmedOrder) })}</div>
            <div class="col-5">${UI.sectionCard({ title: 'Xe và đội vận chuyển', body: UI.crewInfo(confirmedOrder) })}</div>
          </div>
        </div>`,
    },

    '01-dang-nhap': {
      title: 'Đăng nhập',
      height: 720,
      render: () =>
        UI.authCard({
          title: 'Đăng nhập',
          subtitle: 'Hệ thống quản lý dịch vụ chuyển nhà',
          body: `
            ${UI.formField({ label: 'Email', type: 'email', value: AN.email })}
            ${UI.formField({ label: 'Mật khẩu', type: 'password', value: 'matkhau123' })}
            <button type="button" class="btn btn-primary w-100 mt-2">Đăng nhập</button>`,
          footer: `
            <p class="text-center mt-4 mb-0">Chưa có tài khoản? <a href="#">Đăng ký</a></p>
            <p class="text-center mt-2 mb-0"><a href="#">Về trang chủ</a></p>`,
        }),
    },

    '02-dang-ky': {
      title: 'Đăng ký',
      height: 820,
      render: () =>
        UI.authCard({
          title: 'Đăng ký tài khoản',
          subtitle: 'Dành cho khách hàng đặt dịch vụ chuyển nhà',
          body: `
            ${UI.formField({ label: 'Họ tên', value: AN.name })}
            ${UI.formField({ label: 'Email', type: 'email', value: AN.email })}
            ${UI.formField({ label: 'Số điện thoại', value: '09012', error: 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.' })}
            ${UI.formField({ label: 'Mật khẩu', type: 'password', value: 'matkhau123' })}
            <button type="button" class="btn btn-primary w-100 mt-2">Đăng ký</button>`,
          footer: '<p class="text-center mt-4 mb-0">Đã có tài khoản? <a href="#">Đăng nhập</a></p>',
        }),
    },

    '03-ho-so-ca-nhan': {
      title: 'Hồ sơ cá nhân',
      height: 720,
      render: () =>
        UI.customerLayout({
          active: 'Hồ sơ',
          content: `
            ${UI.pageHeader({ title: 'Hồ sơ cá nhân' })}
            <div class="row gx-3 gy-0">
              <div class="col-lg-6">
                ${UI.sectionCard({
                  title: 'Thông tin tài khoản',
                  body: `
                    ${UI.alertBox('success', 'Đã lưu hồ sơ.')}
                    ${UI.formField({ label: 'Email', value: AN.email, disabled: true })}
                    ${UI.formField({ label: 'Vai trò', value: 'Khách hàng', disabled: true })}
                    ${UI.formField({ label: 'Họ tên', value: AN.name })}
                    ${UI.formField({ label: 'Số điện thoại', value: AN.phone })}
                    ${UI.button('Lưu hồ sơ')}`,
                })}
              </div>
              <div class="col-lg-6">
                ${UI.sectionCard({
                  title: 'Đổi mật khẩu',
                  body: `
                    ${UI.formField({ label: 'Mật khẩu cũ', type: 'password' })}
                    ${UI.formField({ label: 'Mật khẩu mới', type: 'password', hint: 'Từ 6 ký tự.' })}
                    ${UI.button('Đổi mật khẩu')}`,
                })}
              </div>
            </div>`,
        }),
    },

    '04-trang-chu-bang-gia': {
      title: 'Trang chủ và bảng giá',
      height: 800,
      render: () =>
        UI.customerLayout({
          active: 'Trang chủ',
          content: `
            <section class="section-card p-4 p-md-5">
              <h1 class="h2 mb-3">Chuyển nhà trọn gói, đặt lịch trong vài phút</h1>
              <p class="text-secondary mb-4">Chọn loại xe, nhập địa chỉ và thời gian, hệ thống báo giá ước tính ngay. Nhân viên sẽ xác nhận và phân công xe cùng đội vận chuyển cho bạn.</p>
              ${UI.button('Đặt dịch vụ')} ${UI.button('Đơn của tôi', 'outline-primary')}
            </section>

            ${UI.pageHeader({ title: 'Bảng giá loại xe', subtitle: 'Giá = giá mở cửa + số km × giá mỗi km. Phụ phí tầng: 50.000đ mỗi tầng, tầng trệt không tính.' })}
            <div class="row g-3 mb-4">
              <div class="col-md-4">${UI.priceCard({ name: 'Xe tải 500 kg', description: 'Phòng trọ, ít đồ · 12.000đ mỗi km', amount: 200000, unit: 'mở cửa' })}</div>
              <div class="col-md-4">${UI.priceCard({ name: 'Xe tải 1 tấn', description: 'Căn hộ 1 phòng ngủ · 15.000đ mỗi km', amount: 300000, unit: 'mở cửa' })}</div>
              <div class="col-md-4">${UI.priceCard({ name: 'Xe tải 2 tấn', description: 'Căn hộ 2 đến 3 phòng ngủ · 20.000đ mỗi km', amount: 500000, unit: 'mở cửa' })}</div>
            </div>

            ${UI.pageHeader({ title: 'Dịch vụ kèm theo' })}
            <div class="row gx-3 gy-0">
              <div class="col-md-4">${UI.priceCard({ name: 'Đóng gói đồ đạc', description: 'Thùng, băng keo và công đóng gói', amount: 200000, unit: 'mỗi đơn' })}</div>
              <div class="col-md-4">${UI.priceCard({ name: 'Tháo lắp nội thất', description: 'Giường, tủ, bàn, kệ', amount: 300000, unit: 'mỗi đơn' })}</div>
              <div class="col-md-4">${UI.priceCard({ name: 'Tháo lắp điều hòa', description: 'Tháo ở nơi đi, lắp ở nơi đến', amount: 400000, unit: 'mỗi máy' })}</div>
            </div>`,
        }),
    },

    '05-dat-dich-vu': {
      title: 'Đặt dịch vụ',
      height: 1080,
      render: () =>
        UI.customerLayout({
          active: 'Đặt dịch vụ',
          content: `
            ${UI.pageHeader({ title: 'Đặt dịch vụ', subtitle: 'Giá bên phải tự cập nhật khi bạn thay đổi thông tin.' })}
            <div class="row gx-3 gy-0">
              <div class="col-lg-7">
                ${UI.sectionCard({
                  title: 'Địa điểm và thời gian',
                  body: `
                    <div class="row gx-3 gy-0">
                      <div class="col-md-9">${UI.formField({ label: 'Địa chỉ nơi đi', value: baseOrder.pickup })}</div>
                      <div class="col-md-3">${UI.formField({ label: 'Số tầng', type: 'number', value: '3' })}</div>
                      <div class="col-md-9">${UI.formField({ label: 'Địa chỉ nơi đến', value: baseOrder.delivery })}</div>
                      <div class="col-md-3">${UI.formField({ label: 'Số tầng', type: 'number', value: '0' })}</div>
                      <div class="col-md-6">${UI.formField({ label: 'Ngày giờ chuyển', value: '05/12/2026 08:00' })}</div>
                      <div class="col-md-6">${UI.formField({ label: 'Quãng đường', type: 'number', value: '12', suffix: 'km' })}</div>
                      <div class="col-12 form-text mt-0">Số tầng: nhà ở tầng trệt nhập 0. Quãng đường: bạn tự ước lượng, nhân viên sẽ kiểm tra lại khi chốt giá.</div>
                    </div>`,
                })}
                ${UI.sectionCard({
                  title: 'Loại xe và dịch vụ kèm theo',
                  body: `
                    ${UI.formField({ label: 'Loại xe', value: 'Xe tải 1 tấn · 300.000đ mở cửa · 15.000đ mỗi km', options: ['Xe tải 500 kg · 200.000đ mở cửa · 12.000đ mỗi km', 'Xe tải 1 tấn · 300.000đ mở cửa · 15.000đ mỗi km'] })}
                    <label class="form-label">Dịch vụ kèm theo</label>
                    ${UI.checkList([
                      { label: 'Đóng gói đồ đạc', note: money(200000), checked: true },
                      { label: 'Tháo lắp nội thất', note: money(300000) },
                      { label: 'Tháo lắp điều hòa', note: money(400000) },
                    ])}
                    <div class="mt-3">${UI.formField({ label: 'Ghi chú', rows: 2, value: baseOrder.note })}</div>`,
                })}
              </div>
              <div class="col-lg-5">
                ${UI.sectionCard({
                  title: 'Giá ước tính',
                  body: `
                    ${UI.priceSummary({ lines: ESTIMATE_LINES, total: 830000 })}
                    <button type="button" class="btn btn-primary w-100 mt-3">Đặt dịch vụ</button>
                    <p class="text-secondary small mt-3 mb-0">Đây là giá ước tính. Nhân viên sẽ liên hệ để chốt giá khi xác nhận đơn.</p>`,
                })}
              </div>
            </div>`,
        }),
    },

    '06-don-cua-toi': {
      title: 'Đơn của tôi',
      height: 720,
      render: () =>
        UI.customerLayout({
          active: 'Đơn của tôi',
          content: `
            ${UI.pageHeader({ title: 'Đơn của tôi', actions: UI.button('Đặt dịch vụ') })}
            ${UI.filterTabs([['Tất cả', 4], ['Chờ xác nhận', 1], ['Đã xác nhận', 1], ['Đang thực hiện', 0], ['Hoàn thành', 1], ['Đã hủy', 1]], 'Tất cả')}
            ${UI.dataTable({
              columns: [
                { label: 'Mã đơn' },
                { label: 'Ngày chuyển' },
                { label: 'Tuyến đường' },
                { label: 'Giá', align: 'end' },
                { label: 'Trạng thái' },
                { label: 'Thanh toán' },
                { label: '', align: 'end' },
              ],
              rows: [
                ['DH0015', when('12/12/2026', '14:00'), route('Ngõ 43 Trần Duy Hưng, Cầu Giấy', 'Chung cư HH2 Linh Đàm, Hoàng Mai'), `${money(1120000)}<div class="cell-sub">ước tính</div>`, UI.statusBadge('order', 'PENDING'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xem'])],
                ['DH0012', when('05/12/2026', '08:00'), route('Ngõ 80 Trần Phú, Hà Đông', 'Tòa CT2 Văn Quán, Hà Đông'), money(850000), UI.statusBadge('order', 'CONFIRMED'), UI.statusBadge('payment', 'DEPOSITED'), UI.rowActions(['Xem'])],
                ['DH0007', when('18/10/2026', '09:00'), route('Số 5 Nguyễn Trãi, Thanh Xuân', 'Ngõ 12 Quang Trung, Hà Đông'), money(640000), UI.statusBadge('order', 'COMPLETED'), UI.statusBadge('payment', 'PAID'), UI.rowActions(['Xem'])],
                ['DH0003', when('02/09/2026', '07:30'), route('Số 5 Nguyễn Trãi, Thanh Xuân', 'Phố Vọng, Hai Bà Trưng'), `${money(520000)}<div class="cell-sub">ước tính</div>`, UI.statusBadge('order', 'CANCELLED'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xem'])],
              ],
            })}`,
        }),
    },

    '07-chi-tiet-don-khach': {
      title: 'Chi tiết đơn (khách)',
      height: 860,
      render: () =>
        customerOrderDetail(
          confirmedOrder,
          UI.button('Quay lại danh sách', 'outline-secondary'),
          'Đơn đã được xác nhận. Nếu cần hủy hoặc đổi lịch, vui lòng liên hệ nhân viên.',
        ),
    },

    '07b-huy-don': {
      title: 'Hủy đơn (hộp thoại)',
      height: 760,
      render: () =>
        customerOrderDetail(
          pendingOrder,
          `${UI.button('Quay lại danh sách', 'outline-secondary')} ${UI.button('Hủy đơn', 'outline-danger')}`,
        ) +
        UI.dialog({
          title: 'Hủy đơn DH0012?',
          body: UI.formField({ label: 'Lý do hủy', rows: 3, value: 'Tôi đổi ngày chuyển nhà sang tháng sau.' }).replace('mb-3', 'mb-0'),
          confirmLabel: 'Hủy đơn',
          cancelLabel: 'Không hủy',
          danger: true,
        }),
    },

    '08-danh-sach-don': {
      title: 'Danh sách đơn',
      height: 800,
      render: () =>
        UI.adminLayout({
          active: 'Đơn hàng',
          role: 'STAFF',
          content: `
            ${UI.pageHeader({ title: 'Đơn hàng', subtitle: 'Đơn mới nhất ở trên cùng.' })}
            ${UI.filterTabs([['Tất cả', 303], ['Chờ xác nhận', 3], ['Đã xác nhận', 5], ['Đang thực hiện', 2], ['Hoàn thành', 262], ['Đã hủy', 31]], 'Tất cả')}
            ${UI.dataTable({
              columns: [
                { label: 'Mã đơn' },
                { label: 'Khách hàng' },
                { label: 'Ngày chuyển' },
                { label: 'Giá', align: 'end' },
                { label: 'Trạng thái' },
                { label: 'Thanh toán' },
                { label: '', align: 'end' },
              ],
              rows: [
                ['DH0015', person(AN), when('12/12/2026', '14:00'), `${money(1120000)}<div class="cell-sub">ước tính</div>`, UI.statusBadge('order', 'PENDING'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xử lý'])],
                ['DH0014', person(CUONG), when('08/12/2026', '08:00'), `${money(410000)}<div class="cell-sub">ước tính</div>`, UI.statusBadge('order', 'PENDING'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xử lý'])],
                ['DH0013', person(BINH), when('06/12/2026', '13:30'), money(1250000), UI.statusBadge('order', 'CONFIRMED'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xử lý'])],
                ['DH0012', person(AN), when('05/12/2026', '08:00'), money(850000), UI.statusBadge('order', 'CONFIRMED'), UI.statusBadge('payment', 'DEPOSITED'), UI.rowActions(['Xử lý'])],
                ['DH0011', person(CUONG), when('24/11/2026', '09:00'), money(720000), UI.statusBadge('order', 'IN_PROGRESS'), UI.statusBadge('payment', 'DEPOSITED'), UI.rowActions(['Xử lý'])],
                ['DH0010', person(BINH), when('20/11/2026', '07:30'), money(1480000), UI.statusBadge('order', 'COMPLETED'), UI.statusBadge('payment', 'PAID'), UI.rowActions(['Xem'])],
                ['DH0009', person(CUONG), when('15/11/2026', '15:00'), `${money(380000)}<div class="cell-sub">ước tính</div>`, UI.statusBadge('order', 'CANCELLED'), UI.statusBadge('payment', 'UNPAID'), UI.rowActions(['Xem'])],
              ],
            })}`,
        }),
    },

    '09-xu-ly-don-cho-xac-nhan': {
      title: 'Chi tiết và xử lý đơn: xác nhận',
      height: 900,
      render: () =>
        staffOrderDetail(
          pendingOrder,
          UI.sectionCard({
            title: 'Xác nhận đơn',
            body: `
              ${UI.formField({ label: 'Giá chốt', value: '850.000', suffix: 'đ', hint: 'Giá ước tính của đơn là 830.000đ.' })}
              ${UI.formField({ label: 'Xe phân công', value: '29C-111.11', options: ['29C-111.11', '29C-222.22'], hint: 'Chỉ hiện xe đang rảnh thuộc loại Xe tải 1 tấn.' })}
              <label class="form-label">Đội vận chuyển</label>
              ${UI.checkList([
                { label: 'Đỗ Văn Hùng', note: 'Tài xế', checked: true },
                { label: 'Lý Minh Tuấn', note: 'Bốc xếp', checked: true },
                { label: 'Vũ Đức Long', note: 'Bốc xếp', checked: true },
                { label: 'Hoàng Văn Nam', note: 'Bốc xếp' },
              ])}
              <div class="form-text mb-3">Chỉ hiện nhân sự đang rảnh.</div>
              <div class="d-flex gap-2">${UI.button('Xác nhận đơn')} ${UI.button('Hủy đơn', 'outline-danger')}</div>`,
          }),
        ),
    },

    '09b-xu-ly-don-da-xac-nhan': {
      title: 'Chi tiết và xử lý đơn: tiến độ và thanh toán',
      height: 940,
      render: () =>
        staffOrderDetail(
          confirmedOrder,
          `
          ${UI.sectionCard({ title: 'Xe và đội vận chuyển', body: UI.crewInfo(confirmedOrder) })}
          ${UI.sectionCard({
            title: 'Tiến độ',
            body: `
              <p class="text-secondary">Bấm Bắt đầu khi đội xuất phát. Xe và đội sẽ chuyển sang Bận cho tới khi đơn hoàn thành.</p>
              <div class="d-flex gap-2">${UI.button('Bắt đầu thực hiện')} ${UI.button('Hủy đơn', 'outline-danger')}</div>`,
          })}
          ${UI.sectionCard({
            title: 'Thanh toán',
            body: `
              ${UI.formField({ label: 'Trạng thái thanh toán', value: 'Đã cọc', options: ['Chưa thanh toán', 'Đã cọc', 'Đã thanh toán'] })}
              ${UI.button('Lưu thanh toán', 'outline-primary')}`,
          })}`,
        ),
    },

    '10-loai-xe-don-gia': { title: 'Loại xe và đơn giá', height: 720, render: vehicleTypeScreen },

    '10b-them-loai-xe': {
      title: 'Thêm loại xe (hộp thoại)',
      height: 720,
      render: () =>
        vehicleTypeScreen() +
        UI.dialog({
          title: 'Thêm loại xe',
          body: `
            ${UI.formField({ label: 'Tên loại xe', value: 'Xe tải 5 tấn' })}
            ${UI.formField({ label: 'Tải trọng', type: 'number', value: '5000', suffix: 'kg' })}
            <div class="row gx-3 gy-0">
              <div class="col-6">${UI.formField({ label: 'Giá mở cửa', value: '1.000.000', suffix: 'đ' })}</div>
              <div class="col-6">${UI.formField({ label: 'Giá mỗi km', value: '30.000', suffix: 'đ' })}</div>
            </div>`,
          confirmLabel: 'Lưu',
        }),
    },

    '11-dich-vu-kem-theo': {
      title: 'Dịch vụ kèm theo',
      height: 720,
      render: () =>
        crudScreen({
          active: 'Dịch vụ kèm theo',
          title: 'Dịch vụ kèm theo',
          subtitle: 'Khách chọn thêm khi đặt dịch vụ; giá cộng thẳng vào giá ước tính.',
          addLabel: 'Thêm dịch vụ',
          columns: [{ label: 'Tên dịch vụ' }, { label: 'Mô tả' }, { label: 'Giá', align: 'end' }, { label: 'Trạng thái' }, { label: '', align: 'end' }],
          rows: [
            ['Đóng gói đồ đạc', 'Thùng, băng keo và công đóng gói', money(200000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
            ['Tháo lắp nội thất', 'Giường, tủ, bàn, kệ', money(300000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
            ['Tháo lắp điều hòa', 'Tháo ở nơi đi, lắp ở nơi đến', money(400000), UI.statusBadge('offer', true), UI.rowActions(['Sửa', 'Xóa'])],
            ['Dọn vệ sinh sau chuyển', 'Quét dọn nhà cũ sau khi chuyển đồ', money(350000), UI.statusBadge('offer', false), UI.rowActions(['Sửa', 'Xóa'])],
          ],
        }),
    },

    '12-xe': {
      title: 'Xe',
      height: 720,
      render: () =>
        crudScreen({
          active: 'Xe',
          title: 'Xe',
          subtitle: 'Xe đang Bận sẽ tự về Rảnh khi đơn của nó hoàn thành.',
          addLabel: 'Thêm xe',
          columns: [{ label: 'Biển số' }, { label: 'Loại xe' }, { label: 'Trạng thái' }, { label: '', align: 'end' }],
          rows: [
            ['29C-111.11', 'Xe tải 1 tấn', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['29C-222.22', 'Xe tải 1 tấn', UI.statusBadge('resource', 'BUSY'), UI.rowActions(['Sửa', 'Xóa'])],
            ['29H-333.33', 'Xe tải 2 tấn', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['29H-444.44', 'Xe tải 2 tấn', UI.statusBadge('resource', 'MAINTENANCE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['29D-555.55', 'Xe tải 500 kg', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
          ],
        }),
    },

    '13-doi-van-chuyen': {
      title: 'Đội vận chuyển',
      height: 760,
      render: () =>
        crudScreen({
          active: 'Đội vận chuyển',
          title: 'Đội vận chuyển',
          subtitle: 'Tài xế và nhân viên bốc xếp. Họ không có tài khoản đăng nhập.',
          addLabel: 'Thêm nhân sự',
          columns: [{ label: 'Họ tên' }, { label: 'Số điện thoại' }, { label: 'Vị trí' }, { label: 'Trạng thái' }, { label: '', align: 'end' }],
          rows: [
            ['Đỗ Văn Hùng', '0903111222', 'Tài xế', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['Ngô Thanh Sơn', '0903222333', 'Tài xế', UI.statusBadge('resource', 'BUSY'), UI.rowActions(['Sửa', 'Xóa'])],
            ['Lý Minh Tuấn', '0903333444', 'Bốc xếp', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['Vũ Đức Long', '0903444555', 'Bốc xếp', UI.statusBadge('resource', 'AVAILABLE'), UI.rowActions(['Sửa', 'Xóa'])],
            ['Hoàng Văn Nam', '0903555666', 'Bốc xếp', UI.statusBadge('resource', 'BUSY'), UI.rowActions(['Sửa', 'Xóa'])],
            ['Bùi Quang Huy', '0903666777', 'Bốc xếp', UI.statusBadge('resource', 'INACTIVE'), UI.rowActions(['Sửa', 'Xóa'])],
          ],
        }),
    },

    '14-tai-khoan-nhan-vien': {
      title: 'Tài khoản nhân viên',
      height: 720,
      render: () =>
        crudScreen({
          active: 'Tài khoản nhân viên',
          title: 'Tài khoản nhân viên',
          subtitle: 'Nhân viên đăng nhập trang quản trị để xử lý đơn. Tài khoản không bị xóa, chỉ bị khóa.',
          addLabel: 'Thêm nhân viên',
          columns: [{ label: 'Họ tên' }, { label: 'Email' }, { label: 'Số điện thoại' }, { label: 'Trạng thái' }, { label: '', align: 'end' }],
          rows: [
            ['Lê Thu Hà', 'ha.le@example.com', '0904111222', UI.statusBadge('account', true), UI.rowActions(['Khóa'])],
            ['Đặng Minh Khoa', 'khoa.dang@example.com', '0904222333', UI.statusBadge('account', true), UI.rowActions(['Khóa'])],
            ['Phan Ngọc Mai', 'mai.phan@example.com', '0904333444', UI.statusBadge('account', false), UI.rowActions(['Mở khóa'])],
          ],
        }),
    },

    '15-thong-ke': {
      title: 'Thống kê',
      height: 960,
      render: () => {
        const revenue = [18.5, 22, 15.4, 27.8, 31.2, 36.5, 41, 38.6, 29.3, 33.7, 44.9, 0];
        const statuses = [['COMPLETED', 262], ['CANCELLED', 31], ['CONFIRMED', 5], ['PENDING', 3], ['IN_PROGRESS', 2]];
        const total = statuses.reduce((sum, [, count]) => sum + count, 0);
        return UI.adminLayout({
          active: 'Thống kê',
          content: `
            ${UI.pageHeader({
              title: 'Thống kê',
              subtitle: 'Doanh thu chỉ tính đơn Hoàn thành, theo giá chốt và theo tháng của ngày chuyển.',
              actions: '<select class="form-select"><option>Năm 2026</option><option>Năm 2025</option></select>',
            })}
            <div class="row g-3 mb-3">
              <div class="col-md-3">${UI.statCard({ label: 'Doanh thu năm', value: '338.900.000đ', hint: 'Đơn đã hoàn thành' })}</div>
              <div class="col-md-3">${UI.statCard({ label: 'Tổng số đơn', value: String(total), hint: 'Mọi trạng thái' })}</div>
              <div class="col-md-3">${UI.statCard({ label: 'Đơn hoàn thành', value: '262', hint: '86,5% tổng số đơn' })}</div>
              <div class="col-md-3">${UI.statCard({ label: 'Đơn đã hủy', value: '31', hint: '10,2% tổng số đơn' })}</div>
            </div>
            ${UI.sectionCard({
              title: 'Doanh thu theo tháng (triệu đồng)',
              body: UI.barChart(revenue, (value) => value.toLocaleString('vi-VN')),
            })}
            ${UI.pageHeader({ title: 'Số đơn theo trạng thái' })}
            ${UI.dataTable({
              columns: [{ label: 'Trạng thái' }, { label: 'Số đơn', align: 'end' }, { label: 'Tỷ lệ', align: 'end' }],
              rows: statuses.map(([status, count]) => [
                UI.statusBadge('order', status),
                String(count),
                ((count / total) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%',
              ]),
            })}`,
        });
      },
    },
  };
})();
