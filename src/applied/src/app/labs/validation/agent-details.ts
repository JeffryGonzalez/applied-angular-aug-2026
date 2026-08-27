import { JsonPipe } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input } from '@angular/core';
import { AgentsStore } from './agents-store';

@Component({
  selector: 'app-agent-details',
  imports: [],
  providers: [AgentsStore],
  template: `
    <p>Agent Details {{ id() }}</p>
    @if (agentResource.error()) {
      <div class="alert alert-error">
        @switch (httpError()?.status) {
          @case (404) {
            <p>No agent with that ID. Maybe we fired them?</p>
          }
          @case (403) {
            <p>You, specifically, are not allowed to see this!</p>
          }
          @default {
            {{ httpError()?.message }}
          }
        }
      </div>
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
  private readonly store = inject(AgentsStore);
  id = input<string>('');
  agentResource = httpResource<{ team: string; name: string }>(() => `/api/agents/${this.id()}`);

  httpError = computed(() => {
    const err = this.agentResource.error();
    return err instanceof HttpErrorResponse ? err : null;
  });

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId !== '') {
        this.store.setSelectedAgent(this.id());
      } else {
        this.store.clearSelectedAgent();
      }
    });
  }
}
