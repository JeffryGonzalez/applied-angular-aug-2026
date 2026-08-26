import { computed, signal } from '@angular/core';
import { Ticket, TicketViewModel } from './ticket';
import { daysSince } from '../util-shared/dates';

const SEED: Ticket[] = [
  {
    id: 4101,
    subject: 'Badge reader offline at dock 3',
    status: 'open',
    openedOn: '2026-08-11',
    assignedTo: 'a-2',
    priority: 'high',
  },
  {
    id: 4102,
    subject: 'Cannot print packing slips',
    status: 'waiting',
    openedOn: '2026-08-14',
    assignedTo: 'a-1',
  },
  {
    id: 4103,
    subject: 'Laptop will not join wifi',
    status: 'open',
    openedOn: '2026-08-19',
    priority: 'normal',
  },
  {
    id: 4104,
    subject: 'Shared drive missing',
    status: 'closed',
    openedOn: '2026-07-30',
    assignedTo: 'a-3',
    priority: 'low',
  },
  {
    id: 4105,
    subject: 'Phone system dropping calls',
    status: 'open',
    openedOn: '2026-08-21',
    assignedTo: 'a-2',
  },
];

export class TicketsStore {
  readonly tickets = signal<Ticket[]>(SEED);

  assign(id: number, agentId: string) {
    this.tickets.update((all) => all.map((t) => (t.id === id ? { ...t, assignedTo: agentId } : t)));
  }

  rows = computed(() => {
    return this.tickets().map((t: Ticket) => {
      return {
        ...t,
        displayTitle: `${t.subject} (${t.status})`,
        ageInDays: daysSince(t.openedOn),
      };
    });
  });
}
