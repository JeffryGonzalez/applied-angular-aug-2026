import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, effect, signal } from '@angular/core';
import { TicketFromApi, TicketsFromApi } from './schemata';
import { extendResource, withPreviousValueOnLoading } from '@ngrx/signals/resource';
import { JsonPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  imports: [JsonPipe, RouterLink, RouterOutlet],
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
    <p>a-1, a-2, a-3</p>
    <input class="input" [value]="id()" (input)="id.set($event.target.value)" />
    <pre>
        {{ agentResource.value() | json }}
    </pre>
    <div class="flex flex-row gap-4">
      <a [routerLink]="['a-1']" class="btn btn-primary">View Agent Details a-1</a>
      <a [routerLink]="['a-2']" class="btn btn-primary">View Agent Details a-2</a>
      <a [routerLink]="['a-3']" class="btn btn-primary">View Agent Details a-3</a>
    </div>

    <div class="p-8 bg-base-100 border-2 rounded-2xl m-8">
      <router-outlet />
    </div>
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

  id = signal('a-1');
  // TODO: Debounced is pretty new - this says only produce a new value every 300 ms.
  idQuery = debounced(this.id, 3000);
  agentResource = httpResource(() => `/api/agents/${this.idQuery.value()}`);

  constructor() {
    effect((cb) => {
      const id = setInterval(() => {
        //this.ticketResource.reload();
      }, 5000);
      cb(() => clearInterval(id));
    });
  }
}
