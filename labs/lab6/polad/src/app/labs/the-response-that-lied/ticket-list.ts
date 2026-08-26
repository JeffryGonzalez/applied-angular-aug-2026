import { Component, computed, inject, signal } from '@angular/core';
import { TicketsApi } from './tickets-api';
import { Ticket } from './wire';

@Component({
  selector: 'app-ticket-list',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-xl">Ticket queue</h2>

      <table class="table w-fit bg-base-100">
        <thead>
          <tr><th>#</th><th>Subject</th><th>Status</th><th>Opened</th><th>Priority</th></tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr>
              <td class="font-mono">{{ row.id }}</td>
              <td>{{ row.subject }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.openedOn }}</td>
              <td>{{ row.priority }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class TicketList {
  private readonly api = inject(TicketsApi);

  private readonly tickets = signal<Ticket[]>([]);

  protected readonly rows = computed(() =>
    this.tickets().map((t) => ({
      id: t.id,
      subject: t.subject.trim(),
      status: t.status,
      openedOn: t.openedOn.slice(0, 10),
      priority: t.priority,
    })),
  );

  constructor() {
    this.api.load().then((tickets) => this.tickets.set(tickets));
  }
}
