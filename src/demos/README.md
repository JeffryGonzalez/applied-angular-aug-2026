# Applied Angular

Your app for the week. Everything is already set up — Angular, Tailwind, daisyUI,
formatting, and the editor snippets. You will not be asked to run `ng new` or
configure a build; that isn't a thing worth practising.

```bash
npm install
npm start
```

## Two things to know before the first lab

**`venues/`** — short files describing what's available to us and where we differ
from what you'd assume. You'll be adding to them all week, and they're the part
of this repo that's worth taking home. Start with `venues/README.md`.

**`.vscode/typescript.code-snippets`** — type `ngc` in an empty `.ts` file for a
component, or `ngrc` to turn whatever's on your clipboard into one. Install the
recommended extensions when prompted.

## Where things go

Each lab is a lazy-loaded feature under `src/app/labs/<lab-name>/`, with one
entry in `src/app/app.routes.ts`. The nav builds itself from that route table, so
adding a lab is a single change and nothing else needs touching.

See `venues/internal/labs.md`.
