import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-agent-details',
  imports: [],
  template: `
    <p>Agent Details {{ id() }}</p>
    @if (agentResource.error()) {
      <div class="alert alert-error">Bummer! {{ httpError()?.status }}</div>
    } @else {
      @if (agentResource.isLoading()) {
        <p>Chill, bro - getting the agent details!</p>
      } @else {
        <p>{{ agentResource.value()?.name }}</p>
        <p>{{ agentResource.value()?.team }}</p>
      }
    }
  `,
  styles: ``,
})
export class AgentDetails {
  id = input<string>('');
  agentResource = httpResource<{ team: string; name: string }>(() => `/api/agents/${this.id()}`);

  httpError = computed(() => {
    const err = this.agentResource.error();
    return err instanceof HttpErrorResponse ? err : null;
  });
}
