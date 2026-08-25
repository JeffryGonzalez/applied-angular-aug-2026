import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { ENV_DESCRIPTOR, SUPER_LOGGER } from './services/custom';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-sm">
        <a class="btn btn-ghost text-xl" routerLink="/">Applied Angular Instructor Demos</a>
        <ul class="menu menu-horizontal px-1">
          @for (lab of labs; track lab.path) {
            <li>
              <a [routerLink]="lab.path">{{ lab.title }}</a>
            </li>
          }
        </ul>
      </div>
      <main class="p-6">
        <router-outlet />
      </main>
    </div>
  `,
  styles: ``,
})
export class App {
  // Nav is generated from the route table so adding a lab is a one-line change
  // in app.routes.ts. See venues/internal/labs.md.
  protected readonly logger = inject(SUPER_LOGGER);
  protected readonly envDescriptor = inject(ENV_DESCRIPTOR);
  protected readonly labs = routes
    .filter((r) => r.title)
    .map((r) => ({ path: r.path ?? '', title: r.title as string }));

  constructor() {
    this.logger('Jeff Was Here');
    this.logger(JSON.stringify(this.envDescriptor));
  }
}
