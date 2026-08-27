import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const AgentsStore = signalStore(
  withState({
    selectedAgentId: null as string | null,
  }),
  withMethods((store) => {
    return {
      setSelectedAgent: (agentId: string) => patchState(store, { selectedAgentId: agentId }),
      clearSelectedAgent: () => patchState(store, { selectedAgentId: null }),
    };
  }),
);
