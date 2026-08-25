import { Routes } from '@angular/router';
import { Settings } from './settings';
import { Timer } from './timer';
import { SessionSettings } from '../../areas/shared/data-session/session-settings';

const routes: Routes = [
  {
    path: '',
    providers: [SessionSettings],
    children: [
      { path: '', component: Timer },
      { path: 'settings', component: Settings },
    ],
  },
];
export default routes;
