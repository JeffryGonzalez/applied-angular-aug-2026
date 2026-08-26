import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TicketFromApi, TicketsFromApi } from './schemata';

@Service({ autoProvided: false })
export class TicketsApi {
  private readonly http = inject(HttpClient);

  async load() {
    const results = await firstValueFrom(this.http.get<TicketFromApi[]>('/api/tickets'));
    const parsedResults = TicketsFromApi.safeParse(results); // better to burn out than fade away.
    if (parsedResults.success) {
      return parsedResults.data;
    } else {
      alert('Done blowed up!');
      console.warn(parsedResults.error);
      return [];
    }
  }
}
