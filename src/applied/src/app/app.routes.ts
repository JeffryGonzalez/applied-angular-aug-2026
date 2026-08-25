import { Routes } from '@angular/router';

// One lazy-loaded feature per lab. `title` doubles as the nav label — see app.ts.
export const routes: Routes = [
  {
    path: 'the-timer-that-ticks',
    title: 'The timer that ticks',
    loadChildren: () => import('./labs/the-timer-that-ticks/routes'),
  },
  {
    path: 'the-setting-two-pages-share',
    title: 'The setting two pages share',
    loadChildren: () => import('./labs/the-setting-two-pages-share/routes'),
  },
];
