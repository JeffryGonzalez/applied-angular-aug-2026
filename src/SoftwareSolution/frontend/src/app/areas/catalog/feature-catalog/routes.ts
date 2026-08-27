import type { Routes } from '@angular/router';
import { Catalog } from './pages/catalog';
import { Home } from './pages/home';
import { Add } from './pages/add';
import { CatalogStore } from './catalog-store';
export const routes: Routes = [
  {
    path: '',
    component: Home,
    providers: [CatalogStore],
    children: [
      {
        path: '',
        component: Catalog,
      },
      {
        path: 'add',
        component: Add,
      },
    ],
  },
];

export default routes;
