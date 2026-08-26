import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: `./status-badge.html`,
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
