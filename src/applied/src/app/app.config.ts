import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
} from '@angular/router';

import { routes } from './app.routes';
import { SessionSettingsStore } from './areas/shared/data-session/session-settings';
// Todo: This is "ganky" - needs venues/bundling

// app.config is compiled into the main.js bundle. it should only EVER refer to things that are owned
// by the app, or in a shared folder.

export const appConfig: ApplicationConfig = {
  providers: [
    // this is saying that this service can be injected anywhere in the entire application.
    // despite the angular docs, it is not a "singleton", and neither is "injectable({providedIn: root})"
    // SessionSettings,
    SessionSettingsStore,
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // A route's providers outlive the route without this. See
      // venues/angular-22.md.
      // this says if you leave a ROUTE that provides a service, it is thrown away, and a new one
      // is created if you return - When is that a good idea? SERVICES THAT HOLD A TON OF DATA.
      withExperimentalAutoCleanupInjectors(),
      // Route and query parameters arrive as component inputs.
      withComponentInputBinding(),
    ),
  ],
};
