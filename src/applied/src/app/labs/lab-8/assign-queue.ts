import { Component, computed, inject, signal } from '@angular/core';
import { Agent, TicketsApi } from './tickets-api';
import { toRow } from './view';
import { TicketFromApi } from './wire';

@Component({
  selector: 'app-assign-queue',
  imports: [],
  template: `
    <h2 class="text-xl mb-2">Assign tickets</h2>

    @if (error(); as message) {
      <div role="alert" class="alert alert-error w-fit my-2"><span>{{ message }}</span></div>
    }

    <table class="table w-fit bg-base-100">
      <tbody>
        @for (row of rows(); track row.id) {
          <tr>
            <td class="font-mono">{{ row.id }}</td>
            <td>{{ row.subject }}</td>
            <td>
              <select
                class="select select-sm select-bordered"
                [disabled]="saving() !== null"
                (change)="assign(row.id, $event)"
              >
                <option value="" [selected]="!row.assignedToId">Unassigned</option>
                @for (agent of agents(); track agent.id) {
                  <option [value]="agent.id" [selected]="agent.id === row.assignedToId">
                    {{ agent.name }}
                  </option>
                }
              </select>
              @if (saving() === row.id) {
                <span class="loading loading-spinner loading-xs ml-2"></span>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class AssignQueue {
  private readonly api = inject(TicketsApi);

  private readonly tickets = signal<TicketFromApi[]>([]);
  protected readonly agents = signal<Agent[]>([]);
  protected readonly saving = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  private readonly now = signal(new Date());

  protected readonly rows = computed(() => this.tickets().map((t) => toRow(t, this.now(), this.agents())));

  constructor() {
    this.api.load().then((t) => this.tickets.set(t));
    this.api.agents().then((a) => this.agents.set(a));
  }

  protected async assign(id: number, event: Event) {
    const name = (event.target as HTMLSelectElement).value;
    this.error.set(null);
    this.saving.set(id);

    try {
      await this.api.assign(id, name);
      this.tickets.update((all) =>
        all.map((t) => (t.id === id ? { ...t, assignedTo: name } : t)),
      );
    } catch {
      this.error.set('That did not save.');
    } finally {
      this.saving.set(null);
    }
  }
}
