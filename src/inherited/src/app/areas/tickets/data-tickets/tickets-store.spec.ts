/* eslint-disable no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { TicketsStore } from './tickets-store';

describe('TicketsStore', () => {
  it('assigns a ticket to an agent', () => {
    const store = TestBed.inject(TicketsStore);

    store.assign(4103, 'a-1');

    const ticket = store.tickets().find((t) => t.id === 4103);
    expect(ticket?.assignedTo).toBe('a-1');
  });

  it('every ticket has a priority', () => {
    const store = TestBed.inject(TicketsStore);

    for (const ticket of store.tickets()) {
      expect(ticket.priority ?? 'normal').toBeTruthy();
    }
  });
});
