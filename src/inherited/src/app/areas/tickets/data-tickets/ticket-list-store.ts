import { signalStore, withComputed, withProps } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AgentsStore } from '../../shared/data-agents/agents-store';
import { TicketsStore } from './tickets-store';

import { daysSince } from '../../shared/util-shared/dates';
import { TicketViewModel } from '../shared-tickets/types';

export const ticketListStore = signalStore(
  withProps(() => ({
    _agents: inject(AgentsStore),
    _tickets: inject(TicketsStore),
  })),
  withComputed((state) => ({
    rows: computed(() => {
      return state._tickets.tickets().map((ticket) => {
        const agent = state._agents.agents().find((a) => a.id === ticket.assignedTo);
        const ageInDays = daysSince(ticket.openedOn);
        return {
          ...ticket,
          displayTitle: `${ticket.subject} (${ticket.status})`,
          agentName: agent ? agent.name : 'Unassigned',
          ageInDays,
        } as TicketViewModel;
      });
    }),
  })),
);
