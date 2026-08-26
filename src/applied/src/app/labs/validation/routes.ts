import { Routes } from '@angular/router';
import { TicketsApi } from './tickets-api';
import { TicketList } from './ticket-list';
import { AgentDetails } from './agent-details';

const routes: Routes = [
  {
    path: '',
    providers: [TicketsApi],
    component: TicketList,
    children: [{ path: ':id', component: AgentDetails }],
  },
];

export default routes;
