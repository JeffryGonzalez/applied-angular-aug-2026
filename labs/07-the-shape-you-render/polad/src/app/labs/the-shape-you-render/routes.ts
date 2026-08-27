import { Routes } from '@angular/router';
import { TicketsApi } from './tickets-api';
import { TicketQueue } from './ticket-queue';

const routes: Routes = [
  { path: '', providers: [TicketsApi], component: TicketQueue },
];

export default routes;
