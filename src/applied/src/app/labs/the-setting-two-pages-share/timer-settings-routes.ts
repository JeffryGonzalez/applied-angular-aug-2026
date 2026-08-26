import { Routes } from '@angular/router';
import { Timer } from './timer';
import { TimerStore } from './timer-store';

const timerserviceRoutes: Routes = [
  {
    path: '',
    providers: [TimerStore],
    children: [{ path: '', component: Timer }],
  },
];
export default timerserviceRoutes;
