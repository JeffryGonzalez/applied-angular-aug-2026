import { Service, signal } from '@angular/core';

export interface Agent {
  id: string;
  name: string;
  team: string;
}

@Service()
export class AgentsStore {
  readonly agents = signal<Agent[]>([
    { id: 'a-1', name: 'R. Okafor', team: 'Desktop' },
    { id: 'a-2', name: 'J. Lindqvist', team: 'Network' },
    { id: 'a-3', name: 'M. Alvarez', team: 'Desktop' },
  ]);

  nameFor(id: string | undefined) {
    return this.agents().find((a) => a.id === id)?.name;
  }
}
