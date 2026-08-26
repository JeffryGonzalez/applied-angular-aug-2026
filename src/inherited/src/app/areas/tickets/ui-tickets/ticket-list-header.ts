import { Component, inject } from '@angular/core';
import { ticketListStore } from '../data-tickets/ticket-list-store';

@Component({
  selector: 'app-ticket-list-header',
  imports: [],
  template: `
    <div class="flex flex-row w-full gap-4">
      <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-44 border p-4">
        <legend class="fieldset-legend">Closed Tickets</legend>
        <label class="label">
          <input
            type="checkbox"
            [checked]="store.showClosed()"
            (click)="store.toggleShowClosed()"
            class="toggle"
          />
          Show closed
        </label>
      </fieldset>
    </div>
  `,
  styles: ``,
})
export class TicketListHeader {
  protected store = inject(ticketListStore);
}
