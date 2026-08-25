import { Component, computed, inject } from '@angular/core';
import { AgentsStore } from '../../data-agents/agents-store';
import { TicketsStore } from '../../../tickets/data-tickets/tickets-store';

@Component({
  selector: 'app-agent-list',
  imports: [],
  template: `
    <ul class="menu bg-base-100 w-96 rounded-box shadow-sm">
      @for (row of rows(); track row.id) {
        <li>
          <span>
            {{ row.name }}
            <span class="badge badge-ghost">{{ row.team }}</span>
            <span class="badge">{{ row.openCount }} open</span>
          </span>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class AgentList {
  private readonly agents = inject(AgentsStore);

  // the workload column has to come from somewhere
  private readonly tickets = inject(TicketsStore);

  protected readonly rows = computed(() => {
    const open = this.tickets.tickets().filter((t) => t.status !== 'closed');
    return this.agents.agents().map((a) => ({
      ...a,
      openCount: open.filter((t) => t.assignedTo === a.id).length,
    }));
  });
}
