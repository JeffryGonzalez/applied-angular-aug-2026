import { TestBed } from '@angular/core/testing';
import { TicketRow } from './ticket-row';

describe('TicketRow', () => {
  it('renders a ticket', async () => {
    const fixture = TestBed.createComponent(TicketRow);
    fixture.componentRef.setInput('ticket', {
      id: 1,
      subject: 'A thing',
      status: 'open',
      openedOn: '2026-08-01',
    });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('1');
  });
});
