import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  providers: [],

  template: `
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-sm">
        <a class="btn btn-ghost text-xl" routerLink="/">Software Center</a>
        <ul class="menu menu-horizontal px-1">
          @for (lab of features; track lab.path) {
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
  protected readonly features = routes
    .filter((r) => r.title)
    .map((r) => ({ path: r.path ?? '', title: r.title as string }));
}
