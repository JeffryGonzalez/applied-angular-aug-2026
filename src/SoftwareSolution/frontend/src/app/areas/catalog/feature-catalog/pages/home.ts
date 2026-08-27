import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-catalog-home',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex flex-row gap-4">
      <a routerLink="." class="btn btn-sm">Home</a>
      <a routerLink="add" class="btn btn-sm">Add Catalog Item</a>
    </div>
    <div class="flex flex-col w-full h-full m-8 bg-base-100 p-4">
      <router-outlet />
    </div>
  `,
  styles: ``,
})
export class Home {}
