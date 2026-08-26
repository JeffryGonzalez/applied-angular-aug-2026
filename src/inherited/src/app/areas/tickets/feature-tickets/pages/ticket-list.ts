import { Component, inject } from '@angular/core';
import { AgentsStore } from '../../../shared/data-agents/agents-store';
import { TicketsStore } from '../../data-tickets/tickets-store';
import { TicketRow } from '../../ui-tickets/ticket-row';
import { ticketListStore } from '../../data-tickets/ticket-list-store';

@Component({
  selector: 'app-ticket-list',
  imports: [TicketRow],
  providers: [ticketListStore],
  template: `
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
            <app-ticket-row [ticket]="ticket" />
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class TicketList {
  protected readonly tickets = inject(TicketsStore);
  private readonly agents = inject(AgentsStore);
  protected readonly store = inject(ticketListStore);

  // decorate the tickets so the table has everything it needs
  // protected readonly rows = computed(() =>
  //   this.tickets.tickets().map((t) => {
  //     t.displayTitle = `${t.subject} (${t.status})`;
  //     t.agentName = this.agents.nameFor(t.assignedTo);
  //     t.ageInDays = daysSince(t.openedOn).days;

  //     return t;
  //   }),
}
