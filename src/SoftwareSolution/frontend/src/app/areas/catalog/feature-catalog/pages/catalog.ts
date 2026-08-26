import { Component, inject } from '@angular/core';
import { CatalogStore } from '../catalog-store';

@Component({
  selector: 'app-catalog',
  providers: [CatalogStore],
  imports: [],
  template: `
    <p>Catalog Works</p>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Vendor ID</th>
        </tr>
      </thead>
      <tbody>
        @for (item of store.catalogWithVendor(); track item.id) {
          <tr [class.opacity-50]="item.isDeprecated" [class.text-red-500]="item.isDeprecated">
            <td>{{ item.name }} {{ item.isDeprecated ? '(Deprecated)' : '' }}</td>
            <td>{{ item.vendor?.name }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: ``,
})
export class Catalog {
  protected store = inject(CatalogStore);
}
