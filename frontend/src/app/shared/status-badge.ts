import { Component, computed, input } from '@angular/core';

export type BadgeKind = 'order' | 'payment' | 'resource' | 'offer' | 'account';

const BADGES: Record<BadgeKind, Record<string, [string, string]>> = {
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

export function badgeLabel(kind: BadgeKind, value: string | boolean): string {
  return BADGES[kind][String(value)]?.[0] ?? String(value);
}

@Component({
  selector: 'app-status-badge',
  template: `<span class="status-badge tone-{{ tone() }}">{{ label() }}</span>`,
})
export class StatusBadge {
  readonly kind = input.required<BadgeKind>();
  readonly value = input.required<string | boolean>();

  protected readonly label = computed(() => badgeLabel(this.kind(), this.value()));
  protected readonly tone = computed(() => BADGES[this.kind()][String(this.value())]?.[1] ?? 'muted');
}
