# Labs

Each lab is a **lazy-loaded feature** with one route in `src/app/app.routes.ts`.
Adding a lab is one entry in that array; nothing else needs touching.

```ts
{
  path: 'the-timer-that-ticks',
  title: 'The timer that ticks',
  loadChildren: () => import('./labs/the-timer-that-ticks/routes'),
}
```

**`title` doubles as the nav label.** `app.ts` builds the top nav by filtering
the route table for routes that have one, so a lab appears in the menu by
existing. There is no separate nav list to keep in sync.

**Labs are named, never numbered.** A lab called `the-link-you-can-send-someone`
is still findable next spring. Numbers exist only in the instructor's materials,
so the order can change without anything here breaking.

**Labs are free-standing.** Where one lab builds on another, the later lab's
starter already contains the earlier one's finished state. Nothing here reaches
across features.

Providers that a lab needs go in **its own route definition's `providers` array**,
not in `app.config.ts`. See `venues/angular-22.md` for why we scope providers
this way.
