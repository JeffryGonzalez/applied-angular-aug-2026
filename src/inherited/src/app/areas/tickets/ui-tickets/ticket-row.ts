import { Component, inject, input } from '@angular/core';
import { AgentsStore } from '../../shared/data-agents/agents-store';
import { TicketsStore } from '../../shared/data-tickets/tickets-store';
import { Ticket } from '../../shared/data-tickets/ticket';
import { AssigneePicker } from '../../shared/ui-shared/assignee-picker';
import { StatusBadge } from '../../shared/ui-shared/status-badge';

@Component({
  selector: 'app-ticket-row',
  imports: [AssigneePicker, StatusBadge],
  template: `
    <td class="font-mono">{{ ticket().id }}</td>
    <td>{{ ticket().displayTitle }}</td>
    <td><app-status-badge [status]="ticket().status" /></td>
    <td>{{ ticket().priority }}</td>
    <td>{{ ticket().ageInDays }}d</td>
    <td>
      <app-assignee-picker [assignedTo]="ticket().assignedTo" (assigned)="onAssigned($event)" />
    </td>
  `,
  styles: ``,
  host: {
    '[style.display]': "'table-row'",
  },
})
export class TicketRow {
  // saves plumbing the event all the way up to the page
  private readonly tickets = inject(TicketsStore);
  private readonly agents = inject(AgentsStore);

  readonly ticket = input.required<Ticket>();

  protected onAssigned(agentId: string) {
    this.tickets.assign(this.ticket().id, agentId);
  }

  protected teamOf(id: string | undefined) {
    return this.agents.agents().find((a) => a.id === id)?.team;
  }
}
