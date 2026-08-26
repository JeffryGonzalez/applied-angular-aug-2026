import { httpResource } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { TicketFromApi, TicketsFromApi } from './schemata';
import { extendResource, withPreviousValueOnLoading } from '@ngrx/signals/resource';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  imports: [JsonPipe],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-xl">Ticket queue</h2>

      @if (ticketResource.error()) {
        <div class="alert alert-error">Bummer!</div>
      } @else {
        @if (ticketResource.isLoading()) {
          <p>Chill, bro - getting the tickets!</p>
        } @else {
          <table class="table w-fit bg-base-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Opened</th>
                <th>Priority</th>
              </tr>
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
                <td class="font-mono"></td>
                <td>No Data! Sorry</td>
                <td>No Data! Sorry</td>
                <td>No Data! Sorry</td>
                <td>No Data! Sorry</td>
              }
            </tbody>
          </table>
        }
      }
    </div>

    <pre>
        {{ assigneeResource.value() | json }}
    </pre>
  `,
  styles: ``,
})
export class TicketList {
  ticketResource = extendResource(
    httpResource<TicketFromApi[]>(() => '/api/tickets', {
      parse: TicketsFromApi.parse,
    }),
    withPreviousValueOnLoading(),
  );

  protected readonly rows = computed(() => {
    const ticks = this.ticketResource.value() || [];
    return ticks.map((t) => ({
      id: t.id,
      subject: t.subject ?? '(no subject)',
      status: t.status,
      openedOn: typeof t.openedOn === 'number' ? new Date(t.openedOn).toISOString() : t.openedOn,
      priority: t.priority ?? 'normal',
    }));
  });

  id = signal(1);
  assigneeResource = httpResource(() => `/api/tickets/99/assignee`);

  constructor() {
    effect((cb) => {
      const id = setInterval(() => this.ticketResource.reload(), 5000);
      cb(() => clearInterval(id));
    });
  }
}
