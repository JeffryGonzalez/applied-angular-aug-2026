import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, validateStandardSchema } from '@angular/forms/signals';
import { zCatalogCreateItem } from '../../../shared/api/zod.gen';
import { CatalogCreateModel, CatalogStore } from '../catalog-store';

@Component({
  selector: 'app-catalog-add',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="form" class="w-full">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Catalog Item</legend>

        <div class="flex flex-row content-start w-fit gap-2 p-4">
          <label class="floating-label"
            ><span>Name of Software</span>
            <input
              class="w-full"
              class="input w-96"
              [formField]="form.name"
              placeholder="Software Name"
            />
          </label>
          @if ((form.name().touched() || form.name().dirty()) && form.name().invalid()) {
            <span class="text-error m-4">
              @for (e of form.name().errors(); track $index) {
                {{ e.message }}
              }
            </span>
          }
        </div>
        <div class="flex flex-row w-fit gap-2 p-4">
          <label class="floating-label"
            ><span>Vendor</span>
            <select class="select w-96" [formField]="form.vendorId">
              @for (vendor of store.vendorResource.value(); track vendor.id) {
                <option [value]="vendor.id">{{ vendor.name }}</option>
              }
            </select>
          </label>
          @if (
            (form.vendorId().touched() || form.vendorId().dirty()) && form.vendorId().invalid()
          ) {
            <span class="text-error m-4">
              @for (e of form.vendorId().errors(); track $index) {
                @switch (e.message) {
                  @case ('Invalid UUID') {
                    Select a vendor
                  }
                  @default {
                    {{ e.message }}
                  }
                }
              }
            </span>
          }
        </div>
        <button type="submit" class="btn btn-primary w-1/3">Add Vendor</button>
      </fieldset>
    </form>
  `,
  styles: ``,
})
export class Add {
  protected readonly store = inject(CatalogStore);
  private model = signal<CatalogCreateModel>({
    name: '',
    vendorId: '',
  });

  protected readonly form = form(this.model, (schemaPath) =>
    validateStandardSchema(schemaPath, zCatalogCreateItem),
  );
}
