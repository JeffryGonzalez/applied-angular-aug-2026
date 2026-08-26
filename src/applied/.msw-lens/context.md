# msw-lens — project context
generated: 2026-08-26T19:57:07.390Z

> Drop this file into any LLM conversation for instant context about what
> is mocked in this project, what scenarios exist, and what is currently active.

## Active scenarios

| endpoint | method | active scenario |
|----------|--------|-----------------|
| `/api/tickets` | GET | `empty` |
| `/api/tickets/:id/assignee` | PUT | `typical` |

## Scenario details

### GET `/api/tickets`
manifest: `src\mocks\tickets\tickets.yaml`
> The ticket queue. Feeds the list in the-response-that-lied and the-shape-you-render.

- **typical** — Every field present and the documented type is true. The app works and nothing is learned.
- **lying** — What the endpoint actually returns in production. Same code, five rows, four different ways of being surprising.
- **empty** ✓ **(active)** — No tickets. Verifies whether an empty state exists — it does not, yet.
- **slow** *(delay: 2000)* — Two second delay. Verifies whether anything is shown while waiting — nothing is.
- **error** — 500 from the server. Verifies the component says something rather than rendering an empty table.
- **missing** — 404. A different failure with the same shape — worth checking they are not handled identically when they should not be.

sourceHints:
- `src/app/labs/the-response-that-lied/wire.ts`
- `src/app/labs/the-response-that-lied/tickets-api.ts`

### PUT `/api/tickets/:id/assignee`
manifest: `src\mocks\tickets\assign.yaml`
> Assigns a ticket to an agent. The write in the-write-that-failed-later.

- **typical** ✓ **(active)** — Succeeds after 400ms. Fast enough to feel fine, slow enough to see.
- **slow** — Succeeds after 2.5s. Shows what a pessimistic UI costs when the network is bad.
- **fails** — 409 after 400ms. The failure arrives while the user is still looking.
- **fails-late** — 409 after 2.5s. The failure arrives after the user has moved on, and there is nowhere to put it.

sourceHints:
- `src/app/labs/the-write-that-failed-later/`

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

