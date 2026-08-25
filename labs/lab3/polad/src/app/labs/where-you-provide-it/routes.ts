import { Routes } from '@angular/router';
import { Settings } from './settings';
import { Timer } from './timer';

const routes: Routes = [
  { path: '', component: Timer },
  { path: 'settings', component: Settings },
];

export default routes;
