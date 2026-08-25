import { Service, signal } from '@angular/core';

// don't break if there is no provider for this when it is injected.
// automatically crete a provider for it.

export class SessionSettings {
  readonly sessionMinutes = signal(25);

  setMinutes(minutes: number) {
    this.sessionMinutes.set(Math.max(1, Math.min(120, minutes)));
  }
}
