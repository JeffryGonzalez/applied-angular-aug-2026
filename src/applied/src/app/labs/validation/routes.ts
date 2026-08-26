import { Routes } from '@angular/router';
import { TicketsApi } from './tickets-api';
import { TicketList } from './ticket-list';

const routes: Routes = [
  { path: '', providers: [TicketsApi], component: TicketList },
];

export default routes;
