import { HttpClient, httpResource } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { addEntity, setEntities, withEntities } from '@ngrx/signals/entities';
import { z } from 'zod';
import { CatalogCreateItem, CatalogItem } from '../../shared/api';
import { zCatalogCreateItem, zVendorModel } from '../../shared/api/zod.gen';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

// type CatalogApiItem = z.infer<typeof zCatalogItem>;
type VendorApiItem = z.infer<typeof zVendorModel>;

export type CatalogCreateModel = z.infer<typeof zCatalogCreateItem>;

export const CatalogStore = signalStore(
  withProps(() => ({
    vendorResource: httpResource<VendorApiItem[]>(() => '/api/vendors'),
  })),
  withEntities<CatalogItem>(),
  withComputed(({ vendorResource, entities }) => ({
    catalogWithVendor: () => {
      const vendors = vendorResource.value() || [];

      return entities().map((catalogItem) => ({
        ...catalogItem,
        vendor: vendors.find((vendorItem) => vendorItem.id === catalogItem.vendorId),
      }));
    },
  })),
  withMethods((store) => {
    const client = inject(HttpClient);
    return {
      _load: () =>
        firstValueFrom(client.get<CatalogItem[]>('/api/catalog')).then((catalogItems) =>
          patchState(store, setEntities(catalogItems)),
        ),
      addCatalogItem: async (item: CatalogCreateItem) => {
        // some method to send it to an api
        // a POST to a collection usually returns the item as if you'd get it from GET /catalog/:id
        // pessimistic would waiting till you get a response back and adding it to the list
        // optimistic would be adding it before the api call.
        // we can do neither.
        const addedItem = await firstValueFrom(
          client.post<CatalogItem>(`/api/vendors/${item.vendorId}/catalog-items`, item),
        );
        // do the api call

        patchState(store, addEntity(addedItem));
        // store.catalogResource.reload();
      },
    };
  }),
  withHooks({
    onInit(store) {
      store._load();
    },
  }),
);
