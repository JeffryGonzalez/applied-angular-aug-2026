import { Service, signal } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

// don't break if there is no provider for this when it is injected.
// automatically crete a provider for it.

// export class SessionSettings {
//   readonly sessionMinutes = signal(25);

//   setMinutes(minutes: number) {
//     this.sessionMinutes.set(Math.max(1, Math.min(120, minutes)));
//   }
// }

export const SessionSettingsStore = signalStore(
  withState({
    sessionMinutes: 25,
  }),
  withMethods((store) => ({
    setMinutes: (minutes: number) =>
      patchState(store, { sessionMinutes: Math.max(1, Math.min(120, minutes)) }),
  })),
);
