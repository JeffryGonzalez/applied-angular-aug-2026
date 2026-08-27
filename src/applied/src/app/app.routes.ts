import { Routes } from '@angular/router';

// One lazy-loaded feature per lab. `title` doubles as the nav label — see app.ts.
export const routes: Routes = [
  {
    path: 'the-timer-that-ticks',
    title: 'The timer that ticks',
    loadChildren: () => import('./labs/the-timer-that-ticks/original-timer-routes'),
  },
  {
    path: 'the-setting-two-pages-share',
    title: 'The setting two pages share',
    loadChildren: () => import('./labs/the-setting-two-pages-share/timer-settings-routes'),
  },
  {
    path: 'tools',
    title: 'Tool List',
    loadChildren: () => import('./labs/tools/tools-routes'),
  },
  {
    path: 'settings',
    title: 'User Settings',
    loadChildren: () => import('./labs/user-settings/user-setting-routes'),
  },
  {
    path: 'validation',
    title: 'Validating API Responses',
    loadChildren: () => import('./labs/validation/routes'),
  },
  {
    path: 'lab7',
    title: 'Lab 7 View Models',
    loadChildren: () => import('./labs/lab-7/routes'),
  },
  {
    path: 'lab8',
    title: 'Lab 8 Outbox',
    loadChildren: () => import('./labs/lab-8/routes'),
  },
];
