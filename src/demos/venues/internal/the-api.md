# The API

There is no server. `/api/*` is answered in the browser by **MSW**, which
installs a service worker and intercepts requests before they leave. Your
`HttpClient` calls are real — the thing at the other end isn't.

This matters because it means the API can be told to misbehave on purpose, which
is the only way to practise handling it.

## Scenarios

Each endpoint has a set of named scenarios, and `src/mocks/active-scenarios.ts`
says which one is live:

```ts
const activeScenarios: Record<string, string> = {
  '/api/tickets': 'typical',
};
```

Change a value, reload, and the same code meets a different server. **No
application code changes** — that's the point of the exercise when a lab asks you
to do it.

`/api/tickets` currently offers `typical`, `lying`, `empty`, and `slow`.

Each endpoint also has a `.yaml` next to its handler describing what it is, what
its scenarios are for, and what's known to be weak about the code that consumes
it. Those files are notes for humans and for AI, not configuration.

## The rule this venue exists to enforce

**One place in the app is allowed to believe the network.** For tickets that's
`TicketsApi.load()`. It parses, and everything downstream works with data that
has been checked.

A type assertion is not a check. `http.get<Ticket[]>(...)` tells TypeScript what
to assume and tells the running program nothing at all.
