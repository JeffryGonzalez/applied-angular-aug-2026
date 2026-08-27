import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TicketsFromApi } from './wire';

@Service({ autoProvided: false })
export class TicketsApi {
  private readonly http = inject(HttpClient);

  // The only place in the app allowed to believe the network. Everything past
  // this line is dealing with data that has been checked.
  async load() {
    const raw = await firstValueFrom(this.http.get<unknown>('/api/tickets'));
    return TicketsFromApi.parse(raw);
  }
}
