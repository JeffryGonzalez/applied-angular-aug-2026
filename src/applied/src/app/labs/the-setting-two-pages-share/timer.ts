import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimerStore } from './timer-store';

@Component({
  selector: 'app-timer',
  imports: [RouterLink],
  providers: [],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body items-center">
        <h2 class="card-title">Focus session</h2>

        <p class="font-mono text-7xl tabular-nums">{{ store.display() }}</p>

        <div class="card-actions">
          <button class="btn btn-primary" (click)="store.toggle()">
            {{ store.running() ? 'Pause' : 'Start' }}
          </button>
          <button class="btn btn-ghost" (click)="store.reset()">Reset</button>
        </div>

        <a class="link link-hover text-sm" routerLink="settings" id="btn-settings">Settings</a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Timer {
  protected readonly store = inject(TimerStore);
}
