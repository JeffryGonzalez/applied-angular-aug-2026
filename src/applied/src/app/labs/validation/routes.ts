import { Routes } from '@angular/router';
import { TicketsApi } from './tickets-api';
import { TicketList } from './ticket-list';
import { AgentDetails } from './agent-details';
import { AddAgent } from './add-agent';

const routes: Routes = [
  {
    path: '',
    providers: [TicketsApi],
    component: TicketList,
    children: [
      { path: 'add', component: AddAgent },
      { path: ':id', component: AgentDetails },
    ],
  },
];

export default routes;
