import { HttpClient, httpResource } from '@angular/common/http';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { z } from 'zod';
import { zCatalogCreateItem, zCatalogItem, zVendorModel } from '../../shared/api/zod.gen';
import { CatalogCreateItem, CatalogItem } from '../../shared/api';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { addEntity, withEntities } from '@ngrx/signals/entities';

// type CatalogApiItem = z.infer<typeof zCatalogItem>;
type VendorApiItem = z.infer<typeof zVendorModel>;

export type CatalogCreateModel = z.infer<typeof zCatalogCreateItem>;

export const CatalogStore = signalStore(
  withProps(() => ({
    catalogResource: httpResource<CatalogItem[]>(() => '/api/catalog'),
    vendorResource: httpResource<VendorApiItem[]>(() => '/api/vendors'),
  })),
  withEntities<CatalogItem>(),
  withComputed(({ catalogResource, vendorResource, entities }) => ({
    catalogWithVendor: () => {
      if (catalogResource.isLoading()) {
        return [];
      }
      const catalogData = catalogResource.value() || [...entities()];
      const vendors = vendorResource.value() || [];

      return catalogData.map((catalogItem) => ({
        ...catalogItem,
        vendor: vendors.find((vendorItem) => vendorItem.id === catalogItem.vendorId),
      }));
    },
  })),
  withMethods((store) => ({
    addCatalogItem: async (item: CatalogCreateItem, client = inject(HttpClient)) => {
      // some method to send it to an api
      // a POST to a collection usually returns the item as if you'd get it from GET /catalog/:id
      // pessimistic would waiting till you get a response back and adding it to the list
      // optimistic would be adding it before the api call.
      // we can do neither.
      //await firstValueFrom(client.post('/api/catalog', item));
      // do the api call
      const itemThatWasAdded: CatalogItem = {
        id: crypto.randomUUID(),
        name: item.name,
        vendorId: item.vendorId,
        isDeprecated: false,
      };
      patchState(store, addEntity(itemThatWasAdded));
      // store.catalogResource.reload();
    },
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log(state);
      });
    },
  }),
);
