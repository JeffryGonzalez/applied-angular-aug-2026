# msw-lens context
generated: 2026-08-27T17:05:45.191Z
entry: src\app\areas\catalog\feature-catalog\pages\add.ts

---

## The ask

I'm working on the `Add` component in a web application and want to
create MSW mock scenarios for the endpoints it depends on.

Based on the source files below, please:

1. Identify the HTTP endpoints this component reaches — through its hooks, stores, services, or direct fetch/http calls
2. For each endpoint, generate a `.yaml` manifest in msw-lens format (see "Manifest pattern" below)
3. For each endpoint, also generate a handler stub (`.ts`) with a switch statement
   over the scenario names (see "Handler pattern" below)
4. Register the new handler in `handlers.ts` — match the import pattern shown above
5. For each scenario, cover: happy path, empty/null states, error conditions
   (with appropriate HTTP status codes), slow/timeout, and any edge cases the
   **response type shape** suggests I haven't anticipated

**On scenario descriptions:** say what UI behavior it tests, not what the data
looks like. Not: "Returns an empty items array." Instead: "Tests that the empty
cart message appears and the checkout button disables."

**If an endpoint already has a manifest** below: do not generate a new one. Suggest
scenarios to add to the existing manifest (or note that coverage is sufficient), and
be explicit about which endpoints you treated this way.

Follow the canonical Manifest pattern in the "About msw-lens" section below. If you
notice anything in the component or its markup that suggests a scenario I should
consider but haven't asked about — flag it.

If the provided files are incomplete — init methods with no visible call site,
protected routes with no guard in scope, dependencies that seem to come from
outside what was crawled — **list your assumptions explicitly** rather than
silently filling the gaps.

---

## Source files

### add.ts
`src\app\areas\catalog\feature-catalog\pages\add.ts`
```typescript
import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  validateStandardSchema,
  required,
} from '@angular/forms/signals';
import { zCatalogCreateItem } from '../../../shared/api/zod.gen';
import { CatalogCreateModel, CatalogStore } from '../catalog-store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-catalog-add',
  imports: [FormField, FormRoot, JsonPipe],
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
              <pre>{{ form.name().errorSummary() | json }}</pre>
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
    <pre> {{ model() | json }}</pre>
  `,
  styles: ``,
})
export class Add {
  protected readonly store = inject(CatalogStore);
  protected model = signal<CatalogCreateModel>({
    name: '',
    vendorId: '',
  });

  protected readonly form = form(
    this.model,
    (schemaPath) => {
      // required(schemaPath.name, { message: 'Give us a name!'})
      validateStandardSchema(schemaPath, zCatalogCreateItem);
    },
    {
      submission: {
        action: async () => {
          await this.store.addCatalogItem(this.model());
          this.form().reset();
        },
      },
    },
  );
}
```

### zod.gen.ts
`src\app\areas\shared\api\zod.gen.ts`
```typescript
// This file is auto-generated by @hey-api/openapi-ts

import * as z from 'zod';

export const zCatalogItem = z.object({
  id: z.uuid().optional(),
  vendorId: z.uuid().optional(),
  name: z.string().min(5).max(100),
  isDeprecated: z.boolean().optional(),
});

export const zCatalogCreateItem = z.object({
  vendorId: z.uuid(),
  name: z.string().min(5).max(100),
});

export const zVendorPointOfContactModel = z.object({
  name: z.string().min(3).max(100),
  email: z.string(),
  phone: z.string(),
});

export const zCreateVendorModel = z.object({
  name: z.string().min(3).max(100),
  url: z.string(),
  pointOfContact: zVendorPointOfContactModel,
});

export const zVendorModel = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  url: z.string(),
  pointOfContact: zVendorPointOfContactModel,
  createdAt: z.iso.datetime().optional(),
});

/**
 * OK
 */
export const zGetCatalogResponse = z.array(zCatalogItem);

export const zGetVendorsByVendorIdCatalogItemsPath = z.object({
  vendorId: z.uuid(),
});

export const zPostVendorsByVendorIdCatalogItemsBody = zCatalogCreateItem;

export const zPostVendorsByVendorIdCatalogItemsPath = z.object({
  vendorId: z.uuid(),
});

/**
 * Created
 */
export const zPostVendorsByVendorIdCatalogItemsResponse = zCatalogItem;

export const zDeleteVendorsByVendorIdCatalogItemsByItemIdPath = z.object({
  vendorId: z.uuid(),
  itemId: z.uuid(),
});

/**
 * OK
 */
export const zGetVendorsResponse = z.array(zVendorModel);

export const zPostVendorsBody = zCreateVendorModel;

export const zPutVendorsByIdPointOfContactBody = zVendorPointOfContactModel;

export const zPutVendorsByIdPointOfContactPath = z.object({
  id: z.uuid(),
});

export const zGetVendorsByIdPath = z.object({
  id: z.uuid(),
});

/**
 * OK
 */
export const zGetVendorsByIdResponse = zVendorModel;
```

### catalog-store.ts
`src\app\areas\catalog\feature-catalog\catalog-store.ts`
```typescript
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
  withMethods((store) => ({
    _load: (client = inject(HttpClient)) =>
      firstValueFrom(client.get<CatalogItem[]>('/api/catalog')).then((catalogItems) =>
        patchState(store, setEntities(catalogItems)),
      ),
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
      store._load();
    },
  }),
);
```

---

## Handler registration

### handlers.ts
`src\mocks\handlers.ts`
```typescript
import { HttpHandler } from 'msw';
import catalogHandler from './catalog/catalog';
import vendorsHandler from './catalog/vendors';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [...catalogHandler, ...vendorsHandler];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
```

---

## Existing manifests + handlers (pattern reference)

### vendors.yaml
`src\mocks\catalog\vendors.yaml`
```yaml
endpoint: /api/vendors
method: GET
shape: collection
description: The vendors the catalog page joins against to show a vendor name per catalog item.

responseType:
  name: zVendorDetailsModel
  path: src/app/areas/shared/api/zod.gen.ts

context:
  sourceHints:
    - src/app/areas/catalog/feature-catalog/pages/catalog.ts
    - src/app/areas/catalog/feature-catalog/catalog-store.ts
    - src/app/areas/shared/api/zod.gen.ts
  hints:
    - "Vendor ids here must match the vendorId values served by GET /api/catalog — both handlers share the VENDOR_IDS constant in src/mocks/catalog/vendors.ts"

scenarios:
  typical:
    description: Tests that every catalog row resolves to a vendor name — five vendors covering all vendorIds in the typical catalog response.
    active: true
  empty:
    description: Tests the join when no vendors come back — every catalog row has a vendorId that matches nothing, so it reveals whether the computed falls back to a placeholder or renders blank.
  slow:
    description: Tests the page while only one of the two resources has resolved — catalog rows are ready but vendor names are not, for three seconds.
    delay: "3000"
```

### vendors.ts
`src\mocks\catalog\vendors.ts`
```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/vendors';

/**
 * Shared with the /api/catalog handler so catalog items point at vendors that
 * actually exist — the catalog/vendor join in CatalogStore depends on it.
 */
export const VENDOR_IDS = {
  acme: '2f4c0b1a-1c2d-4e3f-9a6b-7c8d9e0f1a2b',
  northwind: '7b3e5d90-4a1f-4c62-8d5e-0b9a1c2d3e4f',
  contoso: 'c1d2e3f4-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
  fabrikam: '9e8d7c6b-5a4f-4e3d-8c2b-1a0f9e8d7c6b',
  litware: '4d5e6f70-8a9b-4c1d-9e2f-3a4b5c6d7e8f',
} as const;

const typicalResponse = [
  {
    id: VENDOR_IDS.acme,
    name: 'Acme Integrations',
    url: 'https://developer.acme-integrations.example.com',
    pointOfContact: {
      name: 'Dana Whitfield',
      email: 'dana.whitfield@acme-integrations.example.com',
      phone: '+1-614-555-0142',
    },
    createdAt: '2021-03-17T14:22:05Z',
  },
  {
    id: VENDOR_IDS.northwind,
    name: 'Northwind Traders',
    url: 'https://api.northwindtraders.example.com',
    pointOfContact: {
      name: 'Marcus Oyelaran',
      email: 'marcus.oyelaran@northwindtraders.example.com',
      phone: '+1-206-555-0178',
    },
    createdAt: '2019-11-04T09:05:41Z',
  },
  {
    id: VENDOR_IDS.contoso,
    name: 'Contoso Data Systems',
    url: 'https://developers.contosodata.example.com',
    pointOfContact: {
      name: 'Priya Raghunathan',
      email: 'priya.raghunathan@contosodata.example.com',
      phone: '+1-312-555-0119',
    },
    createdAt: '2022-06-28T17:48:12Z',
  },
  {
    id: VENDOR_IDS.fabrikam,
    name: 'Fabrikam Logistics',
    url: 'https://partners.fabrikamlogistics.example.com',
    pointOfContact: {
      name: 'Tomasz Wieczorek',
      email: 'tomasz.wieczorek@fabrikamlogistics.example.com',
      phone: '+1-773-555-0163',
    },
    createdAt: '2020-08-09T11:31:57Z',
  },
  {
    id: VENDOR_IDS.litware,
    name: 'Litware Analytics',
    url: 'https://docs.litwareanalytics.example.com',
    pointOfContact: {
      name: 'Simone Achterberg',
      email: 'simone.achterberg@litwareanalytics.example.com',
      phone: '+1-503-555-0126',
    },
    createdAt: '2023-01-22T08:14:30Z',
  },
];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'slow':
        await delay(3000);
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
```

### catalog.yaml
`src\mocks\catalog\catalog.yaml`
```yaml
endpoint: /api/catalog
method: GET
shape: collection
description: The full list of catalog items rendered by the Catalog page table.

responseType:
  name: zCatalogCreateModel
  path: src/app/areas/shared/api/zod.gen.ts

context:
  sourceHints:
    - src/app/areas/catalog/feature-catalog/pages/catalog.ts
    - src/app/areas/catalog/feature-catalog/catalog-store.ts
    - src/app/areas/shared/api/zod.gen.ts
  hints:
    - "Every vendorId here comes from the VENDOR_IDS constant in src/mocks/catalog/vendors.ts — change one and the vendor join in CatalogStore breaks for that row"

scenarios:
  typical:
    description: Tests that the catalog table renders a full page of rows with ID, name, vendor ID and deprecated columns populated.
    active: true
  empty:
    description: Tests what the page shows when the table body has no rows — currently just the header and the "Catalog Works" text, so it reveals whether an empty-state message is needed.
  slow:
    description: Tests the three seconds between navigation and the table appearing — reveals that httpResource has no loading/skeleton branch in the template.
    delay: "3000"
```

### catalog.ts
`src\mocks\catalog\catalog.ts`
```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';
import { VENDOR_IDS } from './vendors';

const ENDPOINT = '/api/catalog';

const typicalResponse = [
  {
    id: '0a1b2c3d-0001-4a00-9000-000000000001',
    vendorId: VENDOR_IDS.contoso,
    name: 'Identity Gateway',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0002-4a00-9000-000000000002',
    vendorId: VENDOR_IDS.acme,
    name: 'Ledger Sync',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0003-4a00-9000-000000000003',
    vendorId: VENDOR_IDS.litware,
    name: 'Report Builder',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0004-4a00-9000-000000000004',
    vendorId: VENDOR_IDS.northwind,
    name: 'Batch Importer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0005-4a00-9000-000000000005',
    vendorId: VENDOR_IDS.acme,
    name: 'Webhook Relay',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0006-4a00-9000-000000000006',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Legacy SOAP Bridge',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0007-4a00-9000-000000000007',
    vendorId: VENDOR_IDS.litware,
    name: 'Order Feed',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0008-4a00-9000-000000000008',
    vendorId: VENDOR_IDS.contoso,
    name: 'Inventory Snapshot',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0009-4a00-9000-000000000009',
    vendorId: VENDOR_IDS.northwind,
    name: 'Shipping Rate Engine',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000a-4a00-9000-00000000000a',
    vendorId: VENDOR_IDS.northwind,
    name: 'Supplier Directory',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000b-4a00-9000-00000000000b',
    vendorId: VENDOR_IDS.acme,
    name: 'Returns Processor',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-000c-4a00-9000-00000000000c',
    vendorId: VENDOR_IDS.litware,
    name: 'Tax Calculator',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000d-4a00-9000-00000000000d',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Catalog Search Index',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000e-4a00-9000-00000000000e',
    vendorId: VENDOR_IDS.contoso,
    name: 'Payment Vault',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000f-4a00-9000-00000000000f',
    vendorId: VENDOR_IDS.acme,
    name: 'Fraud Signals',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0010-4a00-9000-000000000010',
    vendorId: VENDOR_IDS.northwind,
    name: 'Statement Renderer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0011-4a00-9000-000000000011',
    vendorId: VENDOR_IDS.litware,
    name: 'Card Tokenizer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0012-4a00-9000-000000000012',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Dispute Workflow',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0013-4a00-9000-000000000013',
    vendorId: VENDOR_IDS.contoso,
    name: 'Settlement Export',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0014-4a00-9000-000000000014',
    vendorId: VENDOR_IDS.acme,
    name: 'Audit Trail Viewer',
    isDeprecated: false,
  },
];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'slow':
        await delay(3000);
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
```

---

## About msw-lens

msw-lens manages MSW scenario switching for web development. Manifests live
alongside handlers under `src/mocks/`. msw-lens writes two tool-owned files:
`src/mocks/active-scenarios.ts` (which scenario is active per endpoint) and
`src/mocks/bypassed-endpoints.ts` (endpoints that pass through to the real API
instead of being mocked). Vite HMR picks up changes immediately.

Both files are tool-owned. Do not include instructions to edit them manually.

Bypass requires MSW worker started with `onUnhandledRequest: 'bypass'` — otherwise
unhandled requests warn or error instead of passing through.

### Manifest pattern (match this exactly)

```yaml
endpoint: /api/resource/   # MUST match the handler's ENDPOINT constant exactly
method: GET
shape: document            # document | collection — determines scenario vocabulary
description: What this endpoint returns

responseType:              # the success-response type
  name: TypeScriptTypeName
  path: relative/path/to/types.ts   # path relative to where you run `lens:context`

errorType:                 # optional — 4xx/5xx response shape (e.g. RFC 9457 ProblemDetails)
  name: ProblemDetails
  path: relative/path/to/types.ts

context:
  sourceHints:             # paths to files that consume this endpoint
    - path/to/store.ts     # LLM reads these directly — provide pointers, not summaries
    - path/to/component.ts
  hints:                   # optional — free-form annotations the code doesn't make obvious
    - "401 always redirects to /login via a route guard"
    - "quantity must be between 1 and 99"

scenarios:
  scenario-name:
    description: What UI behavior this tests (not what the data looks like)
    active: true           # at most one scenario per manifest — marks the default
    httpStatus: 401        # optional — omit for 200
    delay: real            # optional — 'real', 'infinite', or integer-string ms ('2000')
```

Four things are non-negotiable:

1. **`endpoint` MUST match the handler's `ENDPOINT` constant exactly, and both must match what the source actually calls.** If the source uses an absolute URL (e.g. `fetch('https://api.example.com/posts')`), use that absolute URL as both `endpoint` and `ENDPOINT` — MSW intercepts absolute URLs directly. Do not modify the source. The switcher writes keys to `active-scenarios.ts` as `METHOD endpoint` (e.g. `GET /api/cart`); the handler reads keys in the same format. A mismatch is silent — the handler falls through to its default case forever and the switcher appears to do nothing.

2. **`shape` is `document` or `collection` (literal values) for GET endpoints. Omit `shape` for mutations** (POST/PUT/PATCH/DELETE) — the method itself drives the archetype vocabulary.

3. **At most one scenario has `active: true`** — and you should always specify one. The fallback (first scenario in declaration order) reorders silently when the manifest is edited.

4. **`delay` is one of:** `real` (realistic latency), `infinite` (never resolves — tests timeout UI), or an integer-string of milliseconds (`"2000"`).


### Handler pattern (match this exactly)

Every handler follows the shape below. Three things are non-negotiable:

1. **Default-import** `activeScenarios` — the file uses `export default`, not a named export.
2. **Key lookup uses `` `METHOD ${ENDPOINT}` ``** — the switcher writes keys in that format. Missing the method prefix means the switcher has no effect and the handler silently falls through to the default case.
3. **Default-export the handler array** as `HttpHandler[]` — `handlers.ts` aggregates by importing each as a default and spreading.

```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/cart';

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json({ items: [], total: 0 });
      case 'unauthorized':
        // Returning a structured ProblemDetails body — see manifest `errorType`
        return HttpResponse.json(
          { type: 'about:blank', title: 'Session expired', status: 401 },
          { status: 401 }
        );
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay('real');
        return HttpResponse.json(typicalResponse);
      case 'never-resolves':
        // delay('infinite') — request never settles; tests timeout / loading-stuck UI
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
```

Register in `handlers.ts` (with the bypass filter):

```typescript
import { HttpHandler } from 'msw';
import cartHandler from './cart/cart';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [...cartHandler];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
```

`bypassed-endpoints.ts` is tool-owned. The filter removes bypassed endpoints from MSW
registration entirely so matching requests pass through to the real network. Requires
`worker.start({ onUnhandledRequest: 'bypass' })`.

Scenario archetypes to consider:

**Document endpoints** (single item responses):
- `happy-path` — successful response with typical data
- `not-found` — 404, resource doesn't exist
- `unauthorized` — 401, tests auth guards and login redirect
- `server-error` — 500, tests error boundary or fallback UI
- `slow` — MSW delay('real'), tests loading/skeleton states
- `malformed-data` — response missing optional fields or with unexpected nulls

**Collection endpoints** (array/list responses):
- `typical` — N items, normal case
- `empty` — zero items, tests empty-state UI
- `overloaded` — far more items than the UI was designed for (tests pagination, overflow)
- `slow` — tests loading skeleton
- `unauthorized` — 401
- `server-error` — 500

**Mutation endpoints** (POST / PUT / PATCH / DELETE):
- `success` / `created` — 201/202/204, happy path; tests UI confirmation, redirect, or form reset
- `validation-error` — 400/422, field-level ProblemDetails; tests whether error messages surface per-field or as a summary
- `conflict` — 409, duplicate or constraint violation; tests whether the UI surfaces a meaningful message
- `unauthorized` — 401, session expired mid-form; tests redirect or inline session error
- `forbidden` — 403, insufficient role; tests whether the UI blocks submission or shows an access error
- `server-error` — 500; tests whether the form retains input and shows a recoverable error message
- `slow` — MSW delay('real'); tests whether the submit button shows a pending/disabled state during submission
