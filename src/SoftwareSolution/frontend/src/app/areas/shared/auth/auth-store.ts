import { signalStore, withComputed, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { AuthEvents } from './auth-events';
import { computed } from '@angular/core';

export const AuthStore = signalStore(
  withState({
    user: null as string | null,
    groups: [] as string[],
  }),
  withReducer(
    on(AuthEvents.userLoggedIn, (a) => ({ user: a.payload.name, groups: a.payload.groups })),
    on(AuthEvents.userLoggedOut, () => ({ user: null, groups: [] })),
  ),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.user()),
    isHelpDesk: computed(() => store.groups().includes('HelpDesk')),
    isHelpDeskManager: computed(() => store.groups().includes('HelpDeskManager')),
  })),
);
