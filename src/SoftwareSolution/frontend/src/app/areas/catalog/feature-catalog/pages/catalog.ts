import { Component, inject } from '@angular/core';
import { CatalogStore } from '../catalog-store';

@Component({
  selector: 'app-catalog',
  providers: [],
  imports: [],
  template: `
    <p>Software Catalog</p>
    <table class="table">
      <thead>
        <tr>
          <th>Software Item</th>
          <th>Vendor</th>
        </tr>
      </thead>
      <tbody>
        @for (item of store.catalogWithVendor(); track item.id) {
          <tr [class.opacity-50]="item.isDeprecated" [class.text-red-500]="item.isDeprecated">
            <td>{{ item.name }} {{ item.isDeprecated ? '(Deprecated)' : '' }}</td>
            @if (item.vendor) {
              <td>{{ item.vendor.name }}</td>
            } @else {
              @if (store.vendorResource.isLoading()) {
                <td>Loading...</td>
              } @else {
                <td>N/A</td>
              }
            }
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
