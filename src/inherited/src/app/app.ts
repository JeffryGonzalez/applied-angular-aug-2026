import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-sm">
        <span class="btn btn-ghost text-xl">Help Desk</span>
        <ul class="menu menu-horizontal px-1">
          <li><a routerLink="/tickets">Tickets</a></li>
          <li><a routerLink="/agents">Agents</a></li>
        </ul>
      </div>
      <main class="p-6"><router-outlet /></main>
    </div>
  `,
  styles: ``,
})
export class App {}
