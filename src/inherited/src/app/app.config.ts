import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AgentsStore } from './areas/shared/data-agents/agents-store';
import { TicketsStore } from './areas/tickets/data-tickets/tickets-store';

export const appConfig: ApplicationConfig = {
  providers: [
    AgentsStore,
    TicketsStore,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
