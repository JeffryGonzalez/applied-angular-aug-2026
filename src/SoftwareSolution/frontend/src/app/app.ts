import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { routes } from './app.routes';
import { Auth } from './areas/shared/auth/auth';
import { StellarOverlayComponent } from '@hypertheory-labs/stellar-ng-devtools';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Auth, StellarOverlayComponent],
  providers: [],

  template: `
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-sm">
        <a class="btn btn-ghost text-xl" routerLink="/">Software Center</a>
        <ul class="menu menu-horizontal px-1">
          @for (lab of features; track lab.path) {
            <li>
              <a
                class="btn btn-sm"
                [routerLink]="lab.path"
                [routerLinkActive]="['btn-secondary']"
                [routerLinkActiveOptions]="{ exact: true }"
                >{{ lab.title }}</a
              >
            </li>
          }
        </ul>
        <div class="flex-1">
          <app-auth></app-auth>
        </div>
      </div>
      <main class="p-6">
        <router-outlet />
      </main>
      <stellar-overlay />
    </div>
  `,
  styles: ``,
})
export class App {
  protected readonly features = routes
    .filter((r) => r.title)
    .map((r) => ({ path: r.path ?? '', title: r.title as string }));
}
