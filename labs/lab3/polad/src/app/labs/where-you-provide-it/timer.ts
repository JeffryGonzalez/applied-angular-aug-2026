import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionSettings } from './session-settings';

@Component({
  selector: 'app-timer',
  imports: [RouterLink],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body items-center">
        <h2 class="card-title">Focus session</h2>

        <p class="font-mono text-7xl tabular-nums">{{ display() }}</p>

        <div class="card-actions">
          <button class="btn btn-primary" (click)="toggle()">
            {{ running() ? 'Pause' : 'Start' }}
          </button>
          <button class="btn btn-ghost" (click)="reset()">Reset</button>
        </div>

        <a class="link link-hover text-sm" routerLink="../settings">Settings</a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Timer {
  private readonly settings = inject(SessionSettings);

  private readonly remaining = signal(this.settings.sessionMinutes() * 60);
  protected readonly running = signal(false);

  protected readonly display = computed(() => {
    const total = this.remaining();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.running()) return;

      const id = setInterval(() => {
        this.remaining.update((s) => s - 1);
      }, 1000);

      onCleanup(() => clearInterval(id));
    });
  }

  protected toggle() {
    this.running.update((r) => !r);
  }

  protected reset() {
    this.running.set(false);
    this.remaining.set(this.settings.sessionMinutes() * 60);
  }
}
