import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
} from '@angular/router';

import { routes } from './app.routes';
import { AuthStore } from './areas/shared/auth/auth-store';
import { provideStellar } from '@hypertheory-labs/stellar-ng-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    AuthStore,
    provideStellar(),
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
