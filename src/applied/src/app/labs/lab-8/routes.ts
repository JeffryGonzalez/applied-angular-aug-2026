import { Routes } from '@angular/router';
import { TicketsApi } from './tickets-api';
import { AssignQueue } from './assign-queue';

const routes: Routes = [
  { path: '', providers: [TicketsApi], component: AssignQueue },
];

export default routes;
