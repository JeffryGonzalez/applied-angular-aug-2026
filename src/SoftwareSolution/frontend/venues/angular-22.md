# Angular 22

Reference: https://angular.dev

Everything below is where we **differ from, or would surprise, a developer who
knows Angular but hasn't used 22.** If you'd have guessed it, it isn't here.

## Things that changed under you

If your Angular is a few versions old, these are already true and you don't have
to do anything to get them:

- **Standalone is the default.** No NgModules. Do not write `standalone: true` —
  it's the default since v20 and setting it is noise.
- **OnPush is the default.** Do not set `changeDetection` explicitly.
- **Native control flow.** `@if`, `@for`, `@switch` in templates. `*ngIf` and
  friends still work and we don't use them.

## What we use

- **Signals for component state.** `signal()`, `computed()` for anything derived.
  Not `mutate` — `set` or `update`.
- **`input()` and `output()` functions**, not the decorators. `model()` when a
  property is genuinely two-way.
- **`inject()`**, not constructor injection.
- **Host bindings go in the `host` object** of the decorator. Not `@HostBinding`
  or `@HostListener`.

## Where we differ from Angular's own advice

**We prefer inline templates and inline styles — always, not just for small
components.** Angular suggests inline for small components; we go further, and
for a reason that isn't about size. The Angular language service now works
*better* inline than it does across files, and — the real reason — a component
whose template is right there resists having things quietly added to it. When it
gets uncomfortable to look at, that discomfort is the signal. Moving the template
to its own file hides exactly the thing we want visible.

`ngc` and `ngrc` in `.vscode/typescript.code-snippets` do this for you. `ngrc`
takes whatever is on your clipboard as the new component's template.

## Declines

Things that exist and we're not using. Not judgments — just not in our set.

- `ngClass` / `ngStyle` — `class` and `style` bindings instead.
- NgModules.
- Template-driven forms.

---
