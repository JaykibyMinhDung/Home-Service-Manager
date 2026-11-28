import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  template: `
    <div class="dialog-backdrop">
      <div class="dialog" role="dialog" aria-modal="true" [attr.aria-label]="heading()">
        <form (submit)="$event.preventDefault(); confirmed.emit()" novalidate>
          <div class="dialog-header">
            <span>{{ heading() }}</span>
            <button type="button" class="dialog-close" aria-label="Đóng" (click)="closed.emit()">
              &times;
            </button>
          </div>
          <div class="dialog-body"><ng-content /></div>
          <div class="dialog-footer">
            <button type="button" class="btn btn-outline-secondary" (click)="closed.emit()">
              Hủy bỏ
            </button>
            <button type="submit" class="btn" [class.btn-danger]="danger()" [class.btn-primary]="!danger()" [disabled]="busy()">
              {{ busy() ? 'Đang xử lý...' : confirmLabel() }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class Dialog {
  readonly heading = input.required<string>();
  readonly confirmLabel = input('Lưu');
  readonly danger = input(false);
  readonly busy = input(false);

  readonly confirmed = output<void>();
  readonly closed = output<void>();
}
