import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// The API is faked in the browser with MSW. See venues/internal/the-api.md.
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({ quiet: true, onUnhandledRequest: 'bypass' });
}

enableMocking().then(() =>
  bootstrapApplication(App, appConfig).catch((err) => console.error(err)),
);
