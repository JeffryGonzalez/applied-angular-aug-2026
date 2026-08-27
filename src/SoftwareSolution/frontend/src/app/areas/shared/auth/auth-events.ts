import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const AuthEvents = eventGroup({
  source: 'auth',
  events: {
    userLoggedIn: type<{ name: string; groups: string[] }>(),
    userLoggedOut: type<void>(),
  },
});
