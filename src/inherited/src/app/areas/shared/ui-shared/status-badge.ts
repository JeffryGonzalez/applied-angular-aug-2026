import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  template: `<span class="badge" [class]="tone()">{{ status() }}</span>`,
  styles: ``,
})
export class StatusBadge {
  readonly status = input.required<string>();

  protected tone() {
    switch (this.status()) {
      case 'open':
        return 'badge-error';
      case 'waiting':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  }
}
