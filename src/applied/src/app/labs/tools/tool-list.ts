import { Component, computed, inject, input, signal } from '@angular/core';
import { TOOLS, Tool } from './tools';
import { Router } from '@angular/router';

// if you don't get this, your lcd might be TypeScript
// is in the venue of testing, not programming. It is a testing tool.
type Discipline = Tool['discipline'] | 'all';

const OPTIONS: Discipline[] = ['all', 'electrical', 'plumbing', 'framing'];

@Component({
  selector: 'app-tool-list',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <div class="join" role="radiogroup" aria-label="Filter by discipline">
        @for (option of options; track option) {
          <input
            class="join-item btn"
            type="radio"
            name="discipline"
            [attr.aria-label]="option"
            [checked]="chosen() === option"
            (change)="choose(option)"
          />
        }
      </div>

      <p class="text-sm opacity-70">{{ visible().length }} of {{ all.length }}</p>

      <ul class="menu bg-base-100 w-96 rounded-box shadow-sm">
        @for (tool of visible(); track tool.id) {
          <li>
            <span>
              {{ tool.name }}
              <span class="badge badge-ghost">{{ tool.onlyAvailableFrom }}</span>
            </span>
          </li>
        } @empty {
          <li class="p-4 opacity-70">Nothing matches.</li>
        }
      </ul>
    </div>
  `,
  styles: ``,
})
export class ToolList {
  protected readonly all = TOOLS;
  protected readonly options = OPTIONS;
  protected readonly router = inject(Router);

  readonly discipline = input<string>(); // fromurl<string>()
  // protected readonly chosen = signal<Discipline>('all');

  protected readonly visible = computed(() => {
    const chosen = this.chosen();
    return chosen === 'all' ? this.all : this.all.filter((t) => t.discipline === chosen);
  });

  protected choose(option: Discipline) {
    this.router.navigate([], {
      queryParams: { discipline: option === 'all' ? null : option },
      queryParamsHandling: 'merge',
    });
  }

  protected readonly chosen = computed<Discipline>(() => {
    const raw = this.discipline();
    return OPTIONS.includes(raw as Discipline) ? (raw as Discipline) : 'all';
  });
}
