import { Component, inject, input, output } from '@angular/core';
import { AgentsStore } from '../data-agents/agents-store';

@Component({
  selector: 'app-assignee-picker',
  imports: [],
  template: `
    <select
      class="select select-sm select-bordered"
      [value]="assignedTo() ?? ''"
      (change)="pick($event)"
    >
      <option value="">Unassigned</option>
      @for (agent of agents.agents(); track agent.id) {
        <option [selected]="agent.id === assignedTo()" [value]="agent.id">
          {{ agent.name }} ({{ agent.team }})
        </option>
      }
    </select>
  `,
  styles: ``,
})
export class AssigneePicker {
  // it needs the agent list, and this is the only place that has it
  protected readonly agents = inject(AgentsStore);

  readonly assignedTo = input<string>();
  readonly assigned = output<string>();

  protected pick(event: Event) {
    this.assigned.emit((event.target as HTMLSelectElement).value);
  }
}
