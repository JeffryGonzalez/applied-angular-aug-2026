import { httpResource } from '@angular/common/http';
import { signalStore, withComputed, withProps } from '@ngrx/signals';
import { z } from 'zod';
import { zCatalogCreateModel, zVendorDetailsModel } from '../../shared/api/zod.gen';

type CatalogApiItem = z.infer<typeof zCatalogCreateModel>;
type VendorApiItem = z.infer<typeof zVendorDetailsModel>;

export const CatalogStore = signalStore(
  withProps(() => ({
    catalogResourse: httpResource<CatalogApiItem[]>(() => '/api/catalog'),
    vendorResourse: httpResource<VendorApiItem[]>(() => '/api/vendors'),
  })),
  withComputed(({ catalogResourse, vendorResourse }) => ({
    catalogWithVendor: () => {
      if (catalogResourse.isLoading()) {
        return [];
      }
      const catalogData = catalogResourse.value() || [];
      const vendors = vendorResourse.value() || [];

      return catalogData.map((catalogItem) => ({
        ...catalogItem,
        vendor: vendors.find((vendorItem) => vendorItem.id === catalogItem.vendorId),
      }));
    },
  })),
);
