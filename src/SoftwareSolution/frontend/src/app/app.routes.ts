import { Routes } from '@angular/router';

// One lazy-loaded feature per lab. `title` doubles as the nav label — see app.ts.
// You'll add your first entry here in the first lab.
export const routes: Routes = [
  {
    path: 'catalog',
    loadChildren: () => import('./areas/catalog/feature-catalog/routes'),
    title: 'Catalog',
  },
];
