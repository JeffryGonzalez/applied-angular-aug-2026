import { Component, input, output } from '@angular/core';

import { AssigneePicker } from '../../shared/ui-shared/assignee-picker';
import { StatusBadge } from '../../shared/ui-shared/status-badge';
import { TicketViewModel } from '../shared-tickets/types';

@Component({
  selector: 'app-ticket-row',
  imports: [AssigneePicker, StatusBadge],
  template: `
    <td class="font-mono">{{ ticket().id }}</td>
    <td>{{ ticket().displayTitle }}</td>
    <td><app-status-badge [status]="ticket().status" /></td>
    <td>{{ ticket().priority }}</td>
    <td>
      {{ ticket().ageInDays.days }}d {{ ticket().ageInDays.hours }}h
      {{ ticket().ageInDays.minutes }}m
    </td>
    <td>
      @if (ticket().status === 'closed') {
        <span>Ticket is Closed</span>
      } @else {
        <app-assignee-picker [assignedTo]="ticket().assignedTo" (assigned)="onAssigned($event)" />
      }
    </td>
  `,
  styles: ``,
  host: {
    '[style.display]': "'table-row'",
  },
})
export class TicketRow {
  readonly ticket = input.required<TicketViewModel>();

  agentAssignedToTicket = output<string>();
  protected onAssigned(agentId: string) {
    this.agentAssignedToTicket.emit(agentId);
  }
}
