import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', loadChildren: () => import('./areas/tickets/feature-tickets/routes') },
  { path: 'agents', loadChildren: () => import('./areas/agents/feature-agents/routes') },
];
