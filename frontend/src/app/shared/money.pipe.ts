import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    return amount == null ? 'Chưa có' : `${amount.toLocaleString('vi-VN')}đ`;
  }
}
