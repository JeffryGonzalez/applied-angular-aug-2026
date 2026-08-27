import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TicketsFromApi } from './wire';

export interface Agent {
  id: string;
  name: string;
}

@Service({ autoProvided: false })
export class TicketsApi {
  private readonly http = inject(HttpClient);

  async load() {
    return TicketsFromApi.parse(await firstValueFrom(this.http.get<unknown>('/api/tickets')));
  }

  async agents() {
    return firstValueFrom(this.http.get<Agent[]>('/api/agents'));
  }

  async assign(ticketId: number, assignedTo: string) {
    return firstValueFrom(
      this.http.put(`/api/tickets/${ticketId}/assignee`, { assignedTo }),
    );
  }
}
