import { Component, inject } from '@angular/core';
import { ticketListStore } from '../../data-tickets/ticket-list-store';
import { TicketListHeader } from '../../ui-tickets/ticket-list-header';
import { TicketRow } from '../../ui-tickets/ticket-row';

@Component({
  selector: 'app-ticket-list',
  imports: [TicketRow, TicketListHeader],
  providers: [ticketListStore],
  template: `
    <app-ticket-list-header />
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Age</th>
            <th>Assigned</th>
          </tr>
        </thead>
        <tbody>
          @for (ticket of store.rows(); track ticket.id) {
            <app-ticket-row (agentAssignedToTicket)="handle($event)" [ticket]="ticket" />
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class TicketList {
  protected readonly store = inject(ticketListStore);
  handle(agentId: string) {
    // do something here
  }
}
