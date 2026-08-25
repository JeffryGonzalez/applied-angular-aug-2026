# The link you can send someone
**This is the arguably most important thing that people mess up in state management. THE URL IS ALWAY THE MOST AUTHORITATIVE SOURCE OF STATE**
*

> **How this lab works.** First part is the work, second part is the answer
> guide. Use whichever suits you and switch whenever.

---

## A different app, and a real request

New feature, nothing to do with timers. A tool crib: a list of what's on the
shelf, filterable by discipline.

Your starter has the list and the filter working. Run it, click `plumbing`, see
three tools.

Now the request:

> Someone in the yard needs the plumbing list. Send it to them.

Try it. Filter to `plumbing`, copy what's in your address bar, paste it into a
new tab.

You get everything. Nine of nine.

## Where the filter actually is

Open `tool-list.ts`. The filter lives here:

```ts
protected readonly chosen = signal<Discipline>('all');
```

A signal on the component. It works — you can watch it working. And it is
completely private. It exists in one component, in one tab, in one browser, on
one machine, and there is no arrangement of copy and paste that gets it to the
person in the yard.

**That's not a bug.** Nobody said the filter had to be shareable. We're finding
out now that it does, and where it lives is the reason it isn't.

## Put it in the address bar instead

Three changes, and the shape is the point:

1. The component should stop holding the filter and start **reading** it from the
   URL. Angular can hand you a query parameter as a signal input — check
   `venues/angular-22.md`, and if it isn't there yet, that's a hint about what
   you'll be adding later in this lab.
2. Whatever the URL says has to be turned into a real filter value. The URL is a
   string and can say anything.
3. The buttons should stop setting a signal and start **navigating**.

One detail worth getting right: choosing `all` should take the parameter *out* of
the URL rather than setting it to `all`.

> Answer: **"Reading the URL"** and **"Writing the URL"**, in the guide below.

## Send it

Filter to `plumbing`. Look at the address bar.

Copy it. Open a new tab. Paste.

Three tools, filter already highlighted, nobody clicked anything.

**The component no longer remembers the filter.** It doesn't have one. It reads
what the URL says and renders that. The address bar is holding the state, which
is exactly why it can be sent to someone.

## The cold-boot test

This is the fastest thing in the course and you'll use it forever.

**Paste the URL into a fresh tab. What's gone?**

Whatever survived was somewhere durable enough to survive. Whatever vanished was
in memory. Ten seconds, and it settles a question people argue about for an hour.

Run it on three things you've built this morning:

1. The tool list with a filter.
2. The timer with the session set to fifty.
3. A timer that's been running for two minutes.

For each one, before you look: is what happens **right**? Two of those three
should probably behave differently than they do. Decide which two, and what
you'd want instead.

Bring your answers back — this is worth arguing about and there's someone in the
room with opinions.

## Something nobody asked for

Put this in your address bar by hand and load it:

```
?discipline=wizardry
```

Nothing breaks. You get all nine — because of one line you wrote in step 3.

Here's what's worth noticing. **The moment state moved into the URL, it became
something a stranger can type.** A signal in a component can only ever hold what
your own code put in it. A query parameter can hold anything anyone can type into
an address bar, including someone who is fiddling and someone who isn't.

Nobody asked for that check. It's there because of *where the value lives*, and
you didn't have to think about it one step ago.

You've seen this shape once already today. Two labs ago, `setMinutes` clamped the
session length to somewhere between 1 and 120, and nobody asked for that either.
Same shape, different reason.

## Write down what you learned about the venue

Two entries. Check `venues/angular-22.md` for the first and add it if missing,
then start a second file — `venues/internal/urls.md`.

> Answer: **"The two venue entries"**, in the guide below.

## Last two questions

**One.** You've now put a piece of state in four different places in one morning:
a component, a route-scoped service, an app-wide service, and a URL. Write the
list down and put one real thing next to each — from an app you actually work on.

Then find one you think is currently in the wrong place. You'll be right often
enough that this is worth doing at your desk on Monday.

**Two.** The tool list is nine items in a `const`. Tomorrow it comes from a
server, and the server doesn't care what your TypeScript type says.

What happens to this component when a tool comes back with `discipline: null`?

---

# The answer guide

## Reading the URL

Replace the signal with an input, and derive the filter from it:

```ts
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

export class ToolList {
  private readonly router = inject(Router);

  // Bound to the `discipline` query parameter by the router. Nothing in this
  // component remembers the filter — the address bar is holding it.
  readonly discipline = input<string>();

  protected readonly chosen = computed<Discipline>(() => {
    const raw = this.discipline();
    return OPTIONS.includes(raw as Discipline) ? (raw as Discipline) : 'all';
  });
}
```

That isn't an input you pass from a parent template. The router fills it in from
the query string, because `app.config.ts` has:

```ts
provideRouter(routes, withComponentInputBinding())
```

With that on, `?discipline=plumbing` arrives as the `discipline` input, as a
signal, updating whenever the URL changes.

The `OPTIONS.includes(...)` line is doing more than it looks like. Come back to
it after "Something nobody asked for".

## Writing the URL

```ts
protected choose(option: Discipline) {
  this.router.navigate([], {
    queryParams: { discipline: option === 'all' ? null : option },
    queryParamsHandling: 'merge',
  });
}
```

`null` removes the parameter rather than setting it. A URL with nothing extra in
it should mean the default — that keeps shared links short and it means there's
exactly one URL for "everything" instead of two.

`queryParamsHandling: 'merge'` keeps any other query parameters that happen to be
there. Ours is the only one today. It won't be forever.

## The two venue entries

In `venues/angular-22.md`:

```md
## Route and query parameters arrive as inputs

`provideRouter(routes, withComponentInputBinding())`

Then `readonly discipline = input<string>()` on a routed component is filled from
`?discipline=`. It's a signal, so it updates when the URL changes. Route params
and resolver data bind the same way, matched by name.

Cost: the binding is by name and nothing checks it. Rename the parameter and the
input silently goes undefined.
```

That last line is the important half. Write down what a thing costs you, not only
what it gives you.

Then a new file, `venues/internal/urls.md`:

```md
# URLs

A URL is a promise that someone can send it to someone else and get the same
thing. If a piece of state would be meaningful to a second person, it belongs
here. If it wouldn't, it doesn't.

Absent means default. We don't write `?discipline=all` — a clean URL and a
default view are the same thing, and it means there's one URL for "everything"
rather than two.

Anything in a URL is user input. It arrives as a string, it can say anything, and
it can be typed by someone who has never seen your app.
```

Note which file each one went in. The first is Angular's — someone else decided
it and we adopted it. The second is ours; nobody outside this team has any
opinion about whether we write `?discipline=all`.
