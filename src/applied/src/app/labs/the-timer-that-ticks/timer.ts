import { Component, computed, effect, signal } from '@angular/core';

const SESSION_SECONDS = 25 * 60;

@Component({
  selector: 'app-timer',
  imports: [],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body items-center">
        <h2 class="card-title">Focus session...</h2>

        <p class="font-mono text-7xl tabular-nums">{{ display() }}</p>

        <div class="card-actions">
          <button class="btn btn-primary" (click)="toggle()">
            {{ running() ? 'Pause' : 'Start' }}
          </button>
          <button class="btn btn-ghost" (click)="reset()">Reset</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Timer {
  private readonly remaining = signal(SESSION_SECONDS);
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

      // Two different jobs, one line. Pausing re-runs this effect, and without
      // the clear you'd stack a second interval on resume — that one is ours,
      // implied by having a pause button at all. The other one you can't see:
      // when this component is destroyed the interval would keep firing against
      // a component nobody is looking at. Nothing in what we set out to build
      // asked for that. See venues/angular-22.md.
      onCleanup(() => clearInterval(id));
    });
  }

  protected toggle() {
    this.running.update((r) => !r);
  }

  protected reset() {
    this.running.set(false);
    this.remaining.set(SESSION_SECONDS);
  }
}
