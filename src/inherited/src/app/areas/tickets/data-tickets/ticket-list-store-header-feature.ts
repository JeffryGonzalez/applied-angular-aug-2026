import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export function withTicketListHeader() {
  return signalStoreFeature(
    withState({
      showClosed: true,
    }),
    withMethods((state) => ({
      toggleShowClosed: () => patchState(state, { showClosed: !state.showClosed() }),
    })),
  );
}
