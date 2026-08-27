# msw-lens — project context
generated: 2026-08-27T17:54:30.262Z

> Drop this file into any LLM conversation for instant context about what
> is mocked in this project, what scenarios exist, and what is currently active.

## Active scenarios

| endpoint | method | active scenario |
|----------|--------|-----------------|
| `/api/vendors` | GET | `slow` |
| `/api/vendors` | POST | `slow` |
| `/api/catalog` | GET | `typical` |
| `/api/vendors/:vendorId/catalog-items` | POST | `created` |

## Scenario details

### GET `/api/vendors`
manifest: `src\mocks\catalog\vendors.yaml`
> The vendors the catalog page joins against to show a vendor name per catalog item.

- **typical** — Tests that every catalog row resolves to a vendor name — five vendors covering all vendorIds in the typical catalog response.
- **empty** — Tests the join when no vendors come back — every catalog row has a vendorId that matches nothing, so it reveals whether the computed falls back to a placeholder or renders blank.
- **slow** ✓ **(active)** *(delay: 3000)* — Tests the page while only one of the two resources has resolved — catalog rows are ready but vendor names are not, for three seconds.

sourceHints:
- `src/app/areas/catalog/feature-catalog/pages/catalog.ts`
- `src/app/areas/catalog/feature-catalog/catalog-store.ts`
- `src/app/areas/shared/api/zod.gen.ts`

### POST `/api/vendors`
manifest: `src\mocks\catalog\vendors-create.yaml`
> Creates a vendor and returns the created vendor, so an Add Vendor form can pessimistically add the server's entity to the store — the same exercise as POST /api/vendors/:vendorId/catalog-items, but with a nested object in the form.

- **created** *(201)* — Tests that a submit round-trips — the form clears and the new vendor appears in the list with the id and createdAt the server assigned, not client-invented ones.
- **slow** ✓ **(active)** *(201, delay: 3000)* — Tests the three seconds between pressing submit and the vendor appearing — reveals whether the submit button shows a pending/disabled state or can be pressed repeatedly.
- **never-resolves** *(delay: infinite)* — Tests a submission that never settles — reveals whether the form stays locked forever with no timeout or cancel path.
- **validation-error** *(400)* — Tests server rules the client schema cannot know about, including one on a nested field — reveals whether a PointOfContact.Email error can be surfaced next to the nested contact input or only as a form-level summary.
- **conflict** *(409)* — Tests submitting a vendor name that already exists — reveals whether a duplicate shows a meaningful message with the typed values preserved for editing.
- **unauthorized** *(401)* — Tests a session that expired while the form was being filled in — reveals whether the user is redirected to login or left staring at a form that silently cleared.
- **server-error** *(500)* — Tests whether a 500 leaves the typed vendor and contact details in place to retry, or whether the form resets and the work is lost.
- **normalized-url** *(201)* — Tests that the list shows the server's canonicalized URL rather than what was typed — the scenario that fails visibly if the store adds the form model instead of the response body.
- **contact-missing-phone** *(201)* — Tests a created vendor whose contact phone comes back empty — reveals whether the vendor display renders a blank gap or handles a missing contact field.
- **bodiless-200** *(200)* — Tests the response the OpenAPI spec actually documents — a 200 with no body at all, so there is no entity to add and the vendor list has to be reloaded to see the new row.

sourceHints:
- `src/app/areas/catalog/feature-catalog/pages/add.ts`
- `src/app/areas/catalog/feature-catalog/catalog-store.ts`
- `src/mocks/catalog/catalog-items.yaml`
- `src/app/areas/shared/api/zod.gen.ts`

### GET `/api/catalog`
manifest: `src\mocks\catalog\catalog.yaml`
> The full list of catalog items rendered by the Catalog page table.

- **typical** ✓ **(active)** — Tests that the catalog table renders a full page of rows with ID, name, vendor ID and deprecated columns populated.
- **empty** — Tests what the page shows when the table body has no rows — currently just the header and the "Catalog Works" text, so it reveals whether an empty-state message is needed.
- **slow** *(delay: 3000)* — Tests the three seconds between navigation and the table appearing — reveals that httpResource has no loading/skeleton branch in the template.

sourceHints:
- `src/app/areas/catalog/feature-catalog/pages/catalog.ts`
- `src/app/areas/catalog/feature-catalog/catalog-store.ts`
- `src/app/areas/shared/api/zod.gen.ts`

### POST `/api/vendors/:vendorId/catalog-items`
manifest: `src\mocks\catalog\catalog-items.yaml`
> Creates a catalog item for a vendor and returns the created item, so the Add form can pessimistically add the server's entity to the store instead of fabricating one.

- **created** ✓ **(active)** *(201)* — Tests that a submit round-trips — the form clears and the new row appears in the catalog list with the id the server assigned, not a client-generated one.
- **slow** *(201, delay: 3000)* — Tests the three seconds between pressing submit and the row appearing — reveals that the submit button has no pending/disabled state, so it can be pressed repeatedly.
- **never-resolves** *(delay: infinite)* — Tests a submission that never settles — reveals whether the form stays locked forever or silently accepts more submits with no timeout or cancel path.
- **validation-error** *(400)* — Tests a server-side rule the client zod schema cannot know about — reveals whether field-level errors from a ProblemDetails errors dictionary surface next to the name input, or vanish while the form resets anyway.
- **conflict** *(409)* — Tests submitting a name this vendor already uses — reveals whether a duplicate is shown as a meaningful message with the typed values preserved for editing.
- **vendor-not-found** *(404)* — Tests submitting against a vendor that no longer exists (stale dropdown) — reveals what happens when the error body is a bare string rather than the ProblemDetails the UI expects.
- **unauthorized** *(401)* — Tests a session that expired while the form was being filled in — reveals whether the user is redirected to login or left staring at a form that silently cleared.
- **server-error** *(500)* — Tests whether a 500 leaves the typed name and vendor in place to retry, or whether the form resets and the work is lost.
- **renamed-by-server** *(201)* — Tests that the list shows the server's normalized name rather than what was typed — the only scenario that fails visibly if the store adds the form model instead of the response body.
- **deprecated-on-create** *(201)* — Tests a new item that arrives already flagged deprecated — reveals whether the deprecated column reflects the response or the false the client hard-codes today.
- **unknown-vendor-echo** *(201)* — Tests a created item whose vendorId matches nothing in GET /api/vendors — exercises the catalogWithVendor join for a row added after load, where vendor comes back undefined.
- **no-content** *(201)* — Tests a 201 with an empty body and only a Location header — reveals whether the store copes with having no entity to add, or needs to reload the catalog instead.

sourceHints:
- `src/app/areas/catalog/feature-catalog/pages/add.ts`
- `src/app/areas/catalog/feature-catalog/catalog-store.ts`
- `src/app/areas/shared/api/zod.gen.ts`
- `src/app/areas/shared/api/types.gen.ts`

---

## How msw-lens works

msw-lens reads scenario manifests — YAML files co-located with MSW handlers under
`src/mocks/`. The active selection writes to two tool-owned files:

- `src/mocks/active-scenarios.ts` — which scenario is active per endpoint
- `src/mocks/bypassed-endpoints.ts` — endpoints that bypass MSW entirely (pass through to the real API)

Vite HMR picks up file changes immediately. No browser refresh needed.

These files are **tool-owned**. Do not edit them manually; msw-lens regenerates them on every run.

**Bypass requires** MSW worker started with `onUnhandledRequest: 'bypass'` —
otherwise unhandled requests will warn or error instead of passing through.

**Commands:**
- `npm run lens` — interactive scenario switcher (single run)
- `npm run lens:watch` — stay in the switcher, Ctrl+C to exit
- `npm run lens:context -- <component.ts>` — generate a prompt for an LLM

Manifests live alongside handlers: `auth/user.yaml` next to `auth/user.ts`.

---

## Manifest format

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

