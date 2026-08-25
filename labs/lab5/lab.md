# The app you inherited

> **Thirty minutes, and it's the longest lab of the week.** Work half first,
> answer guide second, switch whenever you like.

---

## What you've been handed

This is not your app. It's a different repository — an internal help desk, two
areas, tickets and the agents they're assigned to. Somebody else wrote it and
they aren't here.

Open it and run it.

```bash
npm install
npm start
```

It works. Tickets list, filterable, assignable. Agents page with a workload
count. Nobody is going to give you a medal for finding a crash, because there
isn't one.

Now run the checks:

```bash
npm run build
npx eslint src/app
```

**Everything is green.** Build passes, lint passes, the two tests pass.

That's the situation. Not a broken app — a working one, that somebody has asked
you to add a feature to next week.

## Read it and write down what bothers you

Ten minutes. Read the code. Don't fix anything, don't refactor anything, don't
open a terminal.

Write a list of things that bother you. Be uncharitable. Include the things you'd
feel slightly embarrassed to raise in a code review because they might be fine.

Some places to look, if you want a starting point:

- `src/app/areas/tickets/data-tickets/ticket.ts` — read every field
- the `import` lines at the top of every component
- `src/app/areas/shared/`
- the two `.spec.ts` files

Your list should have somewhere between four and ten things on it. If it has
none, read `ticket.ts` again.

## Which of those are actually wrong?

Go through your list and sort it into three piles:

1. **Wrong.** This will cause somebody a real problem.
2. **Taste.** I'd have done it differently and I can't say it's worse.
3. **I can't tell.**

Pile three is the interesting one and you're allowed to have things in it.

This is the whole exercise, and it's harder than finding the problems. Anyone can
generate a list of complaints about unfamiliar code. Deciding which complaints
are *load-bearing* is the thing that separates a useful review from an annoying
one.

> Answer: **"The six, and the one that isn't"**, in the guide below.

## Write the rule down

Take one thing from your "wrong" pile — ideally something about which file is
allowed to import which — and write it as a **rule**, in one sentence, in
`venues/internal/boundaries.md` in this repo.

Not a description of what's wrong. A statement of what should be true.

Then read your sentence back and ask: **what would happen if somebody broke this
tomorrow?**

Nothing would happen. Nobody would find out. You've written down a preference.

> Answer: **"The rule"**, in the guide below.

## Turn on something that checks it

The repository already has Sheriff installed. Nothing runs it — check
`eslint.config.js` if you want to confirm that.

Wire it up and give it your rule. Then:

```bash
npx eslint src/app
```

> Answer: **"Turning it on"**, in the guide below.

## What it found that you didn't

Compare Sheriff's output with the list you wrote in step 2.

Three questions, and all three matter:

1. **What did Sheriff find that you missed?** No shame in it — it reads every
   import in the repository and you read for ten minutes.
2. **What did you find that Sheriff can't see?** This is the more important
   direction. There are things on your list that no tool will ever flag, and
   knowing which ones those are tells you what code review is actually for.
3. **Did Sheriff flag anything you think is fine?** If so, either your rule is
   wrong or your instinct is. Work out which before moving on.

## The test that should have caught this

You've now got a list of components reaching into other areas' data. There's a
test that ought to catch that kind of thing:

> **Can you construct one part of this app without constructing the rest of it?**

Try it. `src/app/areas/tickets/ui-tickets/ticket-row.spec.ts` already does
exactly that — it builds a `TicketRow` on its own, with no other setup.

It passes. It has always passed. It passed before you started.

**Work out why that test can't fail**, and what would have to be true about this
codebase for it to be able to.

> Answer: **"Why the test can't fail"**, in the guide below.

## Fix exactly one

Not all six. One.

Fix the shared component that reaches into a feature — the one that made her
message about shared components pulling stores from multiple features true.

Then run Sheriff again and confirm the count went down by one.

> Answer: **"Fixing the picker"**, in the guide below.

## Last two questions

**One.** You've got five violations left and you're not fixing them today.
Somebody has to decide what happens to them. Write two sentences: which one you'd
do next, and why that one.

**Two.** Every single thing Sheriff flagged was added by someone who had a
reason. Read the comments next to them — they're all *sensible*. Nobody was being
lazy.

So how does an app get like this? And what would have had to exist, on day one,
for it not to?

---

# The answer guide

## The six, and the one that isn't

Sheriff finds six dependency-rule violations across four files.

**Cross-area imports** — one area reaching into another's data:

- `tickets/feature-tickets/pages/ticket-list.ts` → `AgentsStore`
  — *"decorate the tickets so the table has everything it needs"*
- `tickets/ui-tickets/ticket-row.ts` → `AgentsStore`
  — *"saves plumbing the event all the way up to the page"*
- `agents/feature-agents/pages/agent-list.ts` → `TicketsStore`
  — *"the workload column has to come from somewhere"*

**A shared component reaching into a feature:**

- `shared/ui-shared/assignee-picker.ts` → `AgentsStore`
  — *"it needs the agent list, and this is the only place that has it"*

**A `ui-` component reaching into a data layer**, which is a different rule
broken by the same file:

- `tickets/ui-tickets/ticket-row.ts` → `TicketsStore` and `AgentsStore`

Read those comments again. **Every one of them is true.** The picker really does
need the agent list. The workload column really does have to come from somewhere.
Nobody wrote any of this out of laziness, and that's why nobody stopped it.

**The one that isn't a violation:** `ticket-list.ts` imports `daysSince` from
`shared/util-shared/dates.ts`. That's a shared pure function used by a feature,
which is exactly what `shared/` is for. Sheriff doesn't flag it. If it was on
your "wrong" list, that's worth noticing — *lives in shared* and *is a boundary
problem* are not the same thing.

**Things on your list Sheriff will never find**, and these are the ones worth
having:

- `displayTitle`, `agentName` and `ageInDays` are optional fields on `Ticket`
  that the server never sends. They're view-model junk stuffed into a wire type,
  and `ticket-list.ts` **mutates the store's objects** to fill them in.
- `priority?` is optional because of the comment above it: *"the api doesn't
  always send priority, made optional so the specs pass."* Three optional fields,
  three completely different reasons, and nothing in the type says which is
  which.
- Two stores that do the same thing spelled two different ways —
  `@Injectable({providedIn:'root'})` and `@Service()`. Identical behaviour. Every
  reader has to check.

## The rule

Something like:

```md
Feature areas do not import from each other. If two areas need the same thing,
that thing moves to `areas/shared/`. Nothing in `areas/shared/` may import from
an area.
```

Good rule. Completely inert. It has been true that this codebase should follow it
for as long as the codebase has existed, and it has been broken the entire time,
and the build has been green throughout.

**A boundary nobody checks is a preference.** That's the sentence to take out of
this lab.

## Turning it on

`sheriff.config.ts` at the project root:

```ts
import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  enableBarrelLess: true,

  modules: {
    'src/app/areas/shared/<type>-<name>': ['shared', 'type:<type>'],
    'src/app/areas/<area>/<type>-<name>': ['area:<area>', 'type:<type>'],
  },

  depRules: {
    root: ['*'],
    'area:*': [sameTag, 'shared'],
    'type:feature': ['type:data', 'type:ui', 'type:util', 'type:feature', 'shared'],
    'type:data': ['type:data', 'type:util', 'shared'],
    'type:ui': ['type:ui', 'type:util', 'shared'],
    'type:util': ['type:util', 'shared'],
    shared: ['shared'],
  },
};
```

And in `eslint.config.js`, add the plugin near the top of the exported array:

```js
const sheriff = require("@softarc/eslint-plugin-sheriff");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    plugins: { "@softarc/sheriff": sheriff },
    rules: { "@softarc/sheriff/dependency-rule": "error" },
  },
  // ...everything that was already here
]);
```

Note what the config is: **your rule, in a form something can execute.** The
`depRules` block says the same thing your sentence said. The difference is that
this version fails the build.

## Why the test can't fail

`TicketRow` injects `TicketsStore` and `AgentsStore`. The test builds it with no
providers at all, and it works.

It works because both stores are auto-provided — `providedIn: 'root'` on one,
`@Service()` on the other. Angular's root injector supplies them without anyone
asking. **You can never fail to construct a component whose dependencies all
provide themselves.**

So the instrument that was supposed to detect coupling is blind to it, and the
blindness is caused by the same decision that made the coupling easy.

For that test to be able to fail, the stores would have to be provided
explicitly — `@Service({ autoProvided: false })`, listed by whoever actually
owns them. Then constructing a `TicketRow` in isolation would demand
`AgentsStore`, and demanding it *is the finding*.

Which puts a familiar entry from your own venue file in a new light. Providing
explicitly isn't only about controlling lifetime. It's what makes the dependency
graph something you can be shown.

## Fixing the picker

`assignee-picker.ts` lives in `shared/` and injects `AgentsStore` from the agents
area. The fix isn't to move the picker — it's genuinely shared, two areas want
it. The fix is to stop it fetching.

```ts
export class AssigneePicker {
  readonly agents = input.required<{ id: string; name: string; team: string }[]>();
  readonly assignedTo = input<string>();
  readonly assigned = output<string>();

  protected pick(event: Event) {
    this.assigned.emit((event.target as HTMLSelectElement).value);
  }
}
```

It now takes the list instead of finding it. Whoever renders it has to supply
one, which pushes the question up to somebody who is allowed to answer it.

That's the general move: **a shared component that fetches has an opinion about
where data comes from, and shared things aren't allowed opinions.** It takes
inputs and emits outputs. Everything else belongs to a caller.

Run Sheriff again: five.
