import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // A route's providers outlive the route without this. See
      // venues/angular-22.md.
      withExperimentalAutoCleanupInjectors(),
      // Route and query parameters arrive as component inputs.
      withComponentInputBinding(),
    ),
  ],
};
