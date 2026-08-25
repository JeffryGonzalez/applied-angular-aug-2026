# Where you provide it

> **How this lab works.** First part is the work, second part is the answer
> guide. Use whichever suits you, switch between them whenever, and don't tell
> anyone. Nobody is grading you.

---

## Two things are wrong and only one is visible

Your timer works. Someone can set a session length and both pages agree about it.

Open `src/app/app.config.ts` and look at the import at the top:

```ts
import { SessionSettings } from './labs/the-setting-two-pages-share/session-settings';
```
> Note: The path to the file might be different, depending on how you are proceeding with the labs.

The application's configuration now knows the name of a lab folder. Delete that
lab and the app stops compiling.

That's the visible problem, and it's a five-second fix. The other one you can't
see yet, and it's the lab.

## Move it somewhere app-wide things live

If something is provided in `app.config.ts` it's available everywhere, forever.
It should live somewhere that says so.

Move `session-settings.ts` into `src/app/areas/shared/data-session/` and fix the
imports. Nothing about the app's behaviour changes — this is filing, not design.

Run it and confirm it still works.

> Answer: **"Just filing"**, in the guide below.

## Now provide it wrong, on purpose

Take `SessionSettings` **out** of `app.config.ts` entirely — the import and the
providers entry both.

Instead, give each of your two components its own `providers: [SessionSettings]`
in its decorator metadata.

No errors. It compiles, it runs, both pages render.

Now go to Settings, change it to fifty, and come back to the timer.

**Nothing happened.**

Work out why before reading on.

> Answer: **"Two of them"**, in the guide below.

## Provide it where they meet

Take those `providers` lines back out of both components.

Both pages are already inside something together — the route. Restructure
`routes.ts` so the two pages are children of a route that provides the service,
and confirm it works again.

> Answer: **"Where they meet"**, in the guide below.

## Leave, and come back

Here's the part you couldn't see before.

Set the session to fifty. Now **navigate to a different lab** using the nav at the
top — any of them. Then come back here.

Twenty-five.

Nothing crashed and nothing was lost by mistake. When you left this route, the
thing holding your setting was thrown away, and coming back built a new one. The
service didn't decide that. The route did.

**Ask your instructor to show you what's actually happening.** It's two log
statements and it's worth seeing once.

## So which one was right?

You've now seen the same service in three places, and all three ran without
errors:

| Provided in | Who shares it | How long it lives |
|---|---|---|
| the component | nobody — one each | as long as that component |
| the route | everything under that route | until you navigate away |
| `app.config.ts` | the whole app | as long as the app |

**None of these is the correct answer in general.** They're three answers to a
question nobody asked out loud yet:

> How long should someone's session length last, and who should see it?

If it's a preference — *"I work in fifty-minute blocks"* — then losing it because
they clicked something else is wrong, and it belongs app-wide. Probably somewhere
that outlives the app entirely, which is a conversation for another day.

If it's a property of one focused work session, then it *should* die when you
leave, and route scope is exactly right.

Write down which one you think it is and why. One sentence. You won't be graded
on the answer — you'll be asked whether you had one.

## What Angular is doing here

Two things went into your venue file's territory today. Work out what they are
and check `venues/angular-22.md` for both.

> Answer: **"What belonged to Angular"**, in the guide below.

## Last two questions

**One.** For each of the three placements in that table, name something from a
real application you've worked on that belongs there. Not a category — an actual
thing.

**Two.** You've set your session to fifty minutes. You want to tell a coworker
"use this setup" and send them something.

Can you? What would you have to send?

That's the next lab.

---

# The answer guide

Same lab, with the answers in it. Come here whenever — stuck, curious, short on
time, or because reading suits you better than typing today.

## Just filing

Move the file to `src/app/areas/shared/data-session/session-settings.ts`.

In `timer.ts` and `settings.ts`:

```ts
import { SessionSettings } from '../../areas/shared/data-session/session-settings';
```

And in `app.config.ts`, the same change to its import path.

That's genuinely all. The app behaves identically. What changed is that a folder
called `areas/shared/` now says out loud what `app.config.ts` was quietly
implying: this thing belongs to everybody.

## Two of them

```ts
@Component({
  selector: 'app-timer',
  imports: [RouterLink],
  providers: [SessionSettings],
  template: `...`,
})
```

Go back to Settings after changing it. It still says fifty. The timer says
twenty-five.

Both pages are reading a `SessionSettings`. Both are working perfectly. **They
are not the same object.**

`providers: [SessionSettings]` on a component means *this component gets its own
one*. Two components, two instances. Neither page is broken — there are simply
two settings now, and each page is loyal to its own.

This is the thing to hold on to: **nothing about the service changed.** Same
class, same signal, same file. What changed is one line about *where it comes
from*, and that line decided whether these two pages are talking to each other.

## Where they meet

```ts
const routes: Routes = [
  {
    path: '',
    providers: [SessionSettings],
    children: [
      { path: '', component: Timer },
      { path: 'settings', component: Settings },
    ],
  },
];
```

Set fifty, come back to the timer, fifty minutes. Working again — and
`app.config.ts` no longer knows this lab exists.

One instance, shared by everything under that route, because they are under it
together. Neither component asked to share. The sharing is a consequence of where
that line sits.

## What belonged to Angular

**Where you provide something decides its lifetime and who shares it.** Not a
style preference — you just watched the same class behave three different ways
without touching it. Should already be in your venue file from the last lab;
check that what's there actually says this, and fix it if it only says "provide
things explicitly."

**Route-scoped providers only get cleaned up because we asked for them to be.**
This one almost certainly isn't there. Add it:

```md
## Route providers need `withExperimentalAutoCleanupInjectors`

`provideRouter(routes, withExperimentalAutoCleanupInjectors())`

Without it, a route's providers are created when you first enter the route and
then live for the rest of the app's life — so "scoped to this route" scopes who
can *reach* it but not how long it *lives*. With it, leaving the route destroys
them.

It's experimental. That's the price, and we pay it because route scoping that
never releases anything isn't scoping.
```

Note what that entry does: names a benefit **and** what it costs. An entry with
only benefits in it is advertising.
