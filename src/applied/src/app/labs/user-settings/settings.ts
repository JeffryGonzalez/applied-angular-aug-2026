import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionSettingsStore } from '../../areas/shared/data-session/session-settings';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  providers: [],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Settings</h2>

        <label class="form-control">
          <span class="label-text">Session length (minutes)</span>
          <input
            class="input input-bordered"
            type="number"
            min="1"
            max="120"
            [value]="settings.sessionMinutes()"
            (change)="onChange($event)"
          />
        </label>

        <a class="link link-hover text-sm" routerLink="..">Back to the timer</a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Settings {
  protected readonly settings = inject(SessionSettingsStore);

  protected onChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.settings.setMinutes(value);
  }
}
