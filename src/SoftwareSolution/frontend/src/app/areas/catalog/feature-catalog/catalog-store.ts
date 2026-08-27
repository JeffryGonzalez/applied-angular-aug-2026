import { httpResource } from '@angular/common/http';
import { signalStore, withComputed, withProps } from '@ngrx/signals';
import { z } from 'zod';
import { zCatalogCreateItem, zCatalogItem, zVendorModel } from '../../shared/api/zod.gen';

type CatalogApiItem = z.infer<typeof zCatalogItem>;
type VendorApiItem = z.infer<typeof zVendorModel>;

export type CatalogCreateModel = z.infer<typeof zCatalogCreateItem>;

export const CatalogStore = signalStore(
  withProps(() => ({
    catalogResource: httpResource<CatalogApiItem[]>(() => '/api/catalog'),
    vendorResource: httpResource<VendorApiItem[]>(() => '/api/vendors'),
  })),
  withComputed(({ catalogResource, vendorResource }) => ({
    catalogWithVendor: () => {
      if (catalogResource.isLoading()) {
        return [];
      }
      const catalogData = catalogResource.value() || [];
      const vendors = vendorResource.value() || [];

      return catalogData.map((catalogItem) => ({
        ...catalogItem,
        vendor: vendors.find((vendorItem) => vendorItem.id === catalogItem.vendorId),
      }));
    },
  })),
);
