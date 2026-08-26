import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { SessionSettingsStore } from '../../areas/shared/data-session/session-settings';

type TimerState = {
  remaining: number;
  running: boolean;
  timerId: undefined | number;
};

export const TimerStore = signalStore(
  withProps(() => ({
    settings: inject(SessionSettingsStore),
  })),
  withState<TimerState>({
    remaining: 0,
    running: false,
    timerId: undefined,
  }),
  withComputed((state) => ({
    display: computed(() => {
      const total = state.remaining();
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }),
  })),
  withMethods((state) => ({
    toggle: () => patchState(state, { running: !state.running() }),
    reset: () =>
      patchState(state, { running: false, remaining: state.settings.sessionMinutes() * 60 }),
  })),
  withHooks({
    onInit(store) {
      patchState(store, { remaining: store.settings.sessionMinutes() * 60 });
      effect(() => {
        if (!store.running()) return;
        const id = setInterval(() => {
          // store.remaining.update((s) => s - 1);
          patchState(store, { remaining: store.remaining() - 1, timerId: id });
        }, 1000);
      });
    },
    onDestroy(store) {
      clearInterval(store.timerId());
    },
  }),
);
