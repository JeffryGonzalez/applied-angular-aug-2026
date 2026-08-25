import { Service, signal } from '@angular/core';

@Service({ autoProvided: false })
export class SessionSettings {
  readonly sessionMinutes = signal(25);

  setMinutes(minutes: number) {
    this.sessionMinutes.set(Math.max(1, Math.min(120, minutes)));
  }
}
