/*
 * Bộ component dùng chung của mockup. Mỗi hàm trả về một đoạn HTML.
 * Mọi màn hình trong thư mục này đều ghép từ các hàm dưới đây,
 * nên đổi một component là đổi trên tất cả các màn dùng nó.
 * Tên hàm trùng với tên component Angular sẽ tạo trong frontend/src/app/shared.
 */
(function () {
  const esc = (value) =>
    String(value ?? '').replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );

  const money = (amount) => (amount == null ? 'Chưa có' : amount.toLocaleString('vi-VN') + 'đ');

  /* ---------- StatusBadge ---------- */

  const BADGES = {
    order: {
      PENDING: ['Chờ xác nhận', 'warning'],
      CONFIRMED: ['Đã xác nhận', 'info'],
      IN_PROGRESS: ['Đang thực hiện', 'primary'],
      COMPLETED: ['Hoàn thành', 'success'],
      CANCELLED: ['Đã hủy', 'muted'],
    },
    payment: {
      UNPAID: ['Chưa thanh toán', 'muted'],
      DEPOSITED: ['Đã cọc', 'info'],
      PAID: ['Đã thanh toán', 'success'],
    },
    resource: {
      AVAILABLE: ['Rảnh', 'success'],
      BUSY: ['Bận', 'warning'],
      MAINTENANCE: ['Bảo dưỡng', 'muted'],
      INACTIVE: ['Đã nghỉ', 'muted'],
    },
    offer: { true: ['Đang cung cấp', 'success'], false: ['Ngừng cung cấp', 'muted'] },
    account: { true: ['Hoạt động', 'success'], false: ['Đã khóa', 'danger'] },
  };

  function statusBadge(kind, value) {
    const [label, tone] = BADGES[kind][String(value)];
    return `<span class="status-badge tone-${tone}">${label}</span>`;
  }

  /* ---------- Nút và thông báo ---------- */

  function button(label, variant = 'primary', size = '') {
    const sizeClass = size ? ` btn-${size}` : '';
    return `<button type="button" class="btn btn-${variant}${sizeClass}">${esc(label)}</button>`;
  }

  function alertBox(tone, text) {
    return `<div class="alert alert-${tone} py-2" role="alert">${esc(text)}</div>`;
  }

  /* ---------- FormField ---------- */

  function formField({ label, value = '', type = 'text', placeholder = '', hint, error, disabled, options, rows, suffix }) {
    const invalid = error ? ' is-invalid' : '';
    const disabledAttr = disabled ? ' disabled' : '';
    let control;
    if (options) {
      const items = options
        .map((option) => `<option${option === value ? ' selected' : ''}>${esc(option)}</option>`)
        .join('');
      control = `<select class="form-select${invalid}"${disabledAttr}>${items}</select>`;
    } else if (rows) {
      control = `<textarea class="form-control${invalid}" rows="${rows}" placeholder="${esc(placeholder)}"${disabledAttr}>${esc(value)}</textarea>`;
    } else {
      control = `<input type="${type}" class="form-control${invalid}" value="${esc(value)}" placeholder="${esc(placeholder)}"${disabledAttr} />`;
    }
    if (suffix) {
      control = `<div class="input-group${error ? ' has-validation' : ''}">${control}<span class="input-group-text">${esc(suffix)}</span></div>`;
    }
    const errorHtml = error ? `<div class="invalid-feedback d-block">${esc(error)}</div>` : '';
    const hintHtml = hint ? `<div class="form-text">${esc(hint)}</div>` : '';
    return `<div class="mb-3"><label class="form-label">${esc(label)}</label>${control}${errorHtml}${hintHtml}</div>`;
  }

  /* ---------- CheckList ---------- */

  function checkList(items) {
    const rows = items
      .map(
        (item) => `
        <div class="check-item${item.checked ? ' checked' : ''}">
          <span><span class="check-box"></span>${esc(item.label)}</span>
          <span class="check-note">${esc(item.note ?? '')}</span>
        </div>`,
      )
      .join('');
    return `<div class="check-list">${rows}</div>`;
  }

  /* ---------- PageHeader ---------- */

  function pageHeader({ title, subtitle, actions = '' }) {
    const subtitleHtml = subtitle ? `<div class="page-subtitle">${subtitle}</div>` : '';
    return `
      <div class="page-header">
        <div><h1 class="page-title">${esc(title)}</h1>${subtitleHtml}</div>
        <div class="page-actions">${actions}</div>
      </div>`;
  }

  /* ---------- SectionCard, InfoList ---------- */

  function sectionCard({ title, body }) {
    const titleHtml = title ? `<h2 class="section-title">${esc(title)}</h2>` : '';
    return `<section class="section-card">${titleHtml}${body}</section>`;
  }

  function infoList(items) {
    const rows = items.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${value}</dd>`).join('');
    return `<dl class="info-list">${rows}</dl>`;
  }

  /* ---------- DataTable ---------- */

  function dataTable({ columns, rows, empty = 'Chưa có dữ liệu.' }) {
    const head = columns
      .map((column) => `<th class="${column.align === 'end' ? 'text-end' : ''}">${esc(column.label)}</th>`)
      .join('');
    const body = rows.length
      ? rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell, index) => `<td class="${columns[index].align === 'end' ? 'text-end' : ''}">${cell}</td>`)
                .join('')}</tr>`,
          )
          .join('')
      : `<tr><td colspan="${columns.length}" class="table-empty">${esc(empty)}</td></tr>`;
    return `<div class="data-table"><table class="table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function rowActions(labels) {
    const buttons = labels
      .map((label) => button(label, label === 'Xóa' || label === 'Khóa' ? 'outline-danger' : 'outline-secondary', 'sm'))
      .join('');
    return `<div class="row-actions">${buttons}</div>`;
  }

  /* ---------- FilterTabs ---------- */

  function filterTabs(items, active) {
    const tabs = items
      .map(
        ([label, count]) =>
          `<span class="filter-tab${label === active ? ' active' : ''}">${esc(label)}<span class="filter-count">${count}</span></span>`,
      )
      .join('');
    return `<div class="filter-tabs">${tabs}</div>`;
  }

  /* ---------- PriceSummary ---------- */

  function priceSummary({ lines, total, totalLabel = 'Giá ước tính' }) {
    const rows = lines
      .map(
        ([label, note, amount]) => `
        <div class="price-line">
          <span>${esc(label)}${note ? ` <span class="price-note">(${esc(note)})</span>` : ''}</span>
          <span>${money(amount)}</span>
        </div>`,
      )
      .join('');
    return `
      <div class="price-summary">
        ${rows}
        <div class="price-total"><span>${esc(totalLabel)}</span><span class="amount">${money(total)}</span></div>
      </div>`;
  }

  /* ---------- OrderSteps ---------- */

  function orderSteps(status) {
    const steps = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
    const current = steps.indexOf(status);
    const items = steps
      .map((step, index) => {
        const state = index < current || status === 'COMPLETED' ? 'done' : index === current ? 'current' : '';
        return `<li class="${state}">${BADGES.order[step][0]}</li>`;
      })
      .join('');
    return `<ol class="order-steps">${items}</ol>`;
  }

  /* ---------- OrderInfo, CrewInfo: thông tin đơn, dùng ở cả trang khách và trang quản trị ---------- */

  function orderInfo(order, { showCustomer = false } = {}) {
    const rows = [];
    if (showCustomer) {
      rows.push(['Khách hàng', `${esc(order.customer.name)} · ${esc(order.customer.phone)}`]);
    }
    rows.push(
      ['Nơi đi', `${esc(order.pickup)}<div class="text-secondary small">Tầng ${order.pickupFloor}</div>`],
      ['Nơi đến', `${esc(order.delivery)}<div class="text-secondary small">Tầng ${order.deliveryFloor}</div>`],
      ['Thời gian chuyển', esc(order.time)],
      ['Quãng đường', `${order.km} km`],
      ['Loại xe', esc(order.vehicleType)],
      ['Dịch vụ kèm theo', order.services.length ? esc(order.services.join(', ')) : 'Không có'],
      ['Ghi chú', order.note ? esc(order.note) : 'Không có'],
    );
    return infoList(rows);
  }

  function crewInfo(order) {
    if (!order.vehicle) {
      return '<p class="text-secondary mb-0">Chưa phân công. Xe và đội sẽ hiện ở đây sau khi đơn được xác nhận.</p>';
    }
    return infoList([
      ['Xe', esc(order.vehicle)],
      ['Đội vận chuyển', order.workers.map((worker) => `${esc(worker.name)} (${esc(worker.position)})`).join('<br />')],
    ]);
  }

  /* ---------- StatCard, BarChart ---------- */

  function statCard({ label, value, hint = '' }) {
    return `
      <div class="stat-card">
        <div class="stat-label">${esc(label)}</div>
        <div class="stat-value">${esc(value)}</div>
        <div class="stat-hint">${esc(hint)}</div>
      </div>`;
  }

  function barChart(values, formatValue) {
    const max = Math.max(...values, 1);
    const columns = values
      .map(
        (value) => `
        <div class="bar-column">
          <div class="bar-value">${value ? formatValue(value) : ''}</div>
          <div class="bar" style="height: ${Math.round((value / max) * 100)}%"></div>
        </div>`,
      )
      .join('');
    const labels = values.map((_, index) => `<span>T${index + 1}</span>`).join('');
    return `<div class="bar-chart">${columns}</div><div class="bar-chart-labels">${labels}</div>`;
  }

  /* ---------- Dialog ---------- */

  function dialog({ title, body, confirmLabel = 'Lưu', cancelLabel = 'Hủy bỏ', danger = false }) {
    return `
      <div class="dialog-backdrop">
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="dialog-header"><span>${esc(title)}</span><span class="dialog-close">&times;</span></div>
          <div class="dialog-body">${body}</div>
          <div class="dialog-footer">
            ${button(cancelLabel, 'outline-secondary')}
            ${button(confirmLabel, danger ? 'danger' : 'primary')}
          </div>
        </div>
      </div>`;
  }

  /* ---------- PriceCard ---------- */

  function priceCard({ name, description, amount, unit }) {
    return `
      <div class="price-card">
        <div class="price-card-name">${esc(name)}</div>
        <div class="price-card-desc">${esc(description)}</div>
        <div><span class="price-card-amount">${money(amount)}</span> <span class="text-secondary">${esc(unit)}</span></div>
      </div>`;
  }

  /* ---------- AuthCard: khung trang đăng nhập và đăng ký ---------- */

  function authCard({ title, subtitle, body, footer }) {
    return `
      <div class="auth-page">
        <div class="card shadow-sm auth-card">
          <div class="card-body p-4">
            <h1 class="h4 mb-1">${esc(title)}</h1>
            <p class="text-secondary mb-4">${esc(subtitle)}</p>
            ${body}
            ${footer}
          </div>
        </div>
      </div>`;
  }

  /* ---------- CustomerLayout ---------- */

  const CUSTOMER_LINKS = ['Trang chủ', 'Đặt dịch vụ', 'Đơn của tôi'];

  function customerLayout({ active, user = 'Nguyễn Văn An', content }) {
    const links = (user ? CUSTOMER_LINKS : CUSTOMER_LINKS.slice(0, 1))
      .map((label) => `<a class="${label === active ? 'active' : ''}">${label}</a>`)
      .join('');
    const account = user
      ? `<a class="${active === 'Hồ sơ' ? 'active' : ''}">${esc(user)}</a>
         <button type="button" class="btn btn-sm btn-outline-light">Đăng xuất</button>`
      : `<a>Đăng nhập</a><a class="btn btn-sm btn-light">Đăng ký</a>`;
    return `
      <header class="site-header">
        <nav class="container site-nav">
          <a class="brand">Dịch vụ chuyển nhà</a>
          <div class="nav-links">${links}</div>
          <div class="nav-account">${account}</div>
        </nav>
      </header>
      <main class="container py-4">${content}</main>`;
  }

  /* ---------- AdminLayout ---------- */

  const ADMIN_MENU = [
    ['Đơn hàng', ['STAFF', 'ADMIN']],
    ['Loại xe và đơn giá', ['ADMIN']],
    ['Dịch vụ kèm theo', ['ADMIN']],
    ['Xe', ['ADMIN']],
    ['Đội vận chuyển', ['ADMIN']],
    ['Tài khoản nhân viên', ['ADMIN']],
    ['Thống kê', ['ADMIN']],
    ['Hồ sơ cá nhân', ['STAFF', 'ADMIN']],
  ];

  function adminLayout({ active, role = 'ADMIN', user, content }) {
    const name = user ?? (role === 'ADMIN' ? 'Quản trị viên' : 'Lê Thu Hà');
    const menu = ADMIN_MENU.filter(([, roles]) => roles.includes(role))
      .map(([label]) => `<a class="${label === active ? 'active' : ''}">${label}</a>`)
      .join('');
    return `
      <div class="admin-shell">
        <aside class="sidebar">
          <div class="sidebar-brand">Quản trị chuyển nhà</div>
          <nav class="sidebar-menu">${menu}</nav>
          <div class="sidebar-account">
            <div class="account-name">${esc(name)}</div>
            <div class="account-role">${role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</div>
            <button type="button" class="btn btn-sm btn-outline-light mt-2">Đăng xuất</button>
          </div>
        </aside>
        <main class="admin-content">${content}</main>
      </div>`;
  }

  function mount(html) {
    document.getElementById('app').innerHTML = html;
  }

  window.UI = {
    adminLayout,
    alertBox,
    authCard,
    barChart,
    button,
    checkList,
    crewInfo,
    customerLayout,
    dataTable,
    dialog,
    filterTabs,
    formField,
    infoList,
    money,
    mount,
    orderInfo,
    orderSteps,
    pageHeader,
    priceCard,
    priceSummary,
    rowActions,
    sectionCard,
    statCard,
    statusBadge,
  };
})();
