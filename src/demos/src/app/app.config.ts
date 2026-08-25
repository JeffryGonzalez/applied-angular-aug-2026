import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
} from '@angular/router';

import { routes } from './app.routes';
import { ENV_DESCRIPTOR, getCurrentEnvDescriptor, SUPER_LOGGER } from './services/custom';
import { provideLogging, withDate, withEmojiPrefix, withPrefix } from './services/custom-factory';

// https://angular.dev/guide/di/defining-dependency-providers#injector-hierarchy-in-angular
export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: SUPER_LOGGER, useValue: (x: string) => console.log(x) },
    provideLogging(withPrefix('Instructor Demos'), withDate(), withEmojiPrefix()),
    { provide: ENV_DESCRIPTOR, useFactory: getCurrentEnvDescriptor },
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
