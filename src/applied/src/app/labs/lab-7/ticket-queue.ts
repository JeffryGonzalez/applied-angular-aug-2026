import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ZodError } from 'zod';
import { TicketsApi } from './tickets-api';
import { TicketFromApi } from './wire';

@Component({
  selector: 'app-ticket-queue',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-xl">Ticket queue</h2>

      @if (error(); as message) {
        <div role="alert" class="alert alert-error w-fit"><span>{{ message }}</span></div>
      }

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
          } @empty {
            <tr><td colspan="5" class="opacity-70">Nothing to show.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class TicketQueue {
  private readonly api = inject(TicketsApi);

  private readonly tickets = signal<TicketFromApi[]>([]);
  protected readonly error = signal<string | null>(null);
  // Everything the screen needs, worked out here, inline.
  protected readonly rows = computed(() =>
    this.tickets().map((t) => ({
      id: t.id,
      subject: t.subject ?? '(no subject)',
      status: t.status,
      openedOn:
        typeof t.openedOn === 'number' ? new Date(t.openedOn).toISOString() : t.openedOn,
      priority: t.priority ?? 'normal',
    })),
  );

  constructor() {
    this.api
      .load()
      .then((tickets) => this.tickets.set(tickets))
      .catch((e: unknown) => this.error.set(describe(e)));
  }
}

function describe(e: unknown) {
  if (e instanceof HttpErrorResponse) {
    return e.status === 404
      ? 'That queue does not exist.'
      : `The ticket service is not answering right now (${e.status}). Nothing is wrong with your data.`;
  }
  if (e instanceof ZodError) {
    return 'The ticket service answered with something we do not recognise.';
  }
  return 'Something went wrong loading tickets.';
}
