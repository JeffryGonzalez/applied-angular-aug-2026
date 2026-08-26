import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Ticket } from './wire';

@Service({ autoProvided: false })
export class TicketsApi {
  private readonly http = inject(HttpClient);

  load() {
    return firstValueFrom(this.http.get<Ticket[]>('/api/tickets'));
  }
}
