# The shape you render

> Work half first, answer guide second.

---

## Where you left it

Your ticket queue works. The response is parsed at the boundary, the component
handles a null subject and a numeric date, and nothing crashes on the `lying`
scenario.

Run it and confirm. Leave the scenario on `lying` for this whole lab — that's the
real data and you may as well work with it.

## A request that sounds trivial

> Sort the queue by how long tickets have been open. Oldest first.

Try it. Sort the rows in your `computed` by `openedOn`.

Sixty seconds, then read on.

## Why you can't

`openedOn` is `string | number`. To sort, you need to compare, and comparing a
string to a number is a question with no good answer.

You could normalise inside the sort. But look at what you'd be doing: converting
the same field twice, once for display and once for comparison, in two places,
from a type that admits both. And the next requirement — *show the age in days* —
would be a third.

**The problem isn't the sort. It's that you're rendering a shape that was never
designed for a screen.** It was designed by whoever built the API, for their own
reasons, and it arrives with unions and optionals and two date formats because
that's honest about their world. It is not honest about yours.

## Write the shape you actually want

Make a new file, `view.ts`, and write down — by hand — the shape the *screen*
needs. Not the shape the server sends.

Two rules, and they're the whole exercise:

- **Nothing optional.** If the screen shows an assignee, the type has an
  assignee. Always. Even when the server didn't send one.
- **Nothing a union.** The template should never have to ask what kind of thing
  it's holding.

Include what the screen needs and nothing else. The queue needs an age in days, a
displayable assignee name, and a way to know a ticket is archived.

> Answer: **"The shape the screen needs"**, in the guide below.

## Write the one function that connects them

Now write the function that turns one wire ticket into one row.

Put it in `view.ts`, next to the type. This function is the only place in your
application where both shapes are in scope at once.

One detail that matters more than it looks: **the function should take the
current time as a parameter** rather than calling `new Date()` inside itself.
You'll see why in two steps.

> Answer: **"The border crossing"**, in the guide below.

## Now do the sort

Go back and sort by age.

It's one line, and it's boring. That's the result you were after.

Then add a second sort — by priority — and put the choice in the URL, the way you
did two labs ago.

> Answer: **"The sort that was hard"**, in the guide below.

## The thing you can now test

Your mapping is a plain function. It takes a wire ticket and a time, returns a
row, touches nothing else.

Write tests for it. No `TestBed`, no component fixture, no fake timers — you pass
in a date because you made it a parameter.

Cover at least: a null subject, an assignee that arrives as an object, and **the
same age coming out of both date formats.**

That last one is the sort bug from three steps ago, pinned so it can't come back.

> Answer: **"Testing a border crossing"**, in the guide below.

## What just happened to your component

Look at the component now.

The template renders `row.assignee`, `row.ageInDays`, `row.subject`. Every one is
a plain value. There is no `??` in the template, no `typeof`, no conditional.

**The component no longer knows the API exists.** Give it a different backend
tomorrow and the only thing that changes is one function in one file.

Look at what moved, too: the decision that a missing assignee displays as
"Unassigned" used to be buried in a template expression. Now it's a line in a
function with a name, and somebody could disagree with it in a code review.

## Write it down

One venue entry, and it's `internal/` — nobody outside this team has an opinion
about this.

> Answer: **"The venue entry"**, in the guide below.

## Last two questions

**One.** `ageInDays` for a ticket that was closed three months ago currently
counts up forever. Is that right?

Nobody said. Decide, write one sentence, and notice that you couldn't have asked
this question two labs ago — the concept "age" didn't exist yet. **Naming a thing
is what makes it possible to be wrong about it.**

**Two.** Your view model has an `assignee` that's a string. Somewhere there's an
agents endpoint with names and teams on it.

If the queue needed to show a team as well, where would that join happen — in
`toRow`, in the component, or somewhere else entirely? What does each choice cost?

---

# The answer guide

## The shape the screen needs

```ts
export interface TicketRow {
  id: number;
  subject: string;
  status: string;
  isArchived: boolean;
  openedOn: Date;
  ageInDays: number;
  priority: 'low' | 'normal' | 'high';
  assignee: string;
}
```

Read it against `TicketFromApi` and notice: **not one optional, not one union.**

That's not a coincidence or a style choice. It's the definition of the job. The
wire type is honest about a world where things are missing; the view type is a
promise to the template that they aren't. Every `?` you remove here is a `??` the
template doesn't have to contain.

`isArchived` is worth a second look. The wire has `status: string`, which can be
anything. The screen needs a yes-or-no. **Deciding that `'ARCHIVED'` means
archived is a piece of business logic**, and it now lives in a file rather than
in a template expression somebody will copy-paste wrong.

## The border crossing

```ts
const DAY = 86_400_000;

export function toRow(t: TicketFromApi, now: Date): TicketRow {
  const openedOn = typeof t.openedOn === 'number'
    ? new Date(t.openedOn)
    : new Date(t.openedOn);

  return {
    id: t.id,
    subject: t.subject ?? '(no subject)',
    status: t.status.toLowerCase(),
    isArchived: t.status.toLowerCase() === 'archived',
    openedOn,
    ageInDays: Math.max(0, Math.floor((now.getTime() - openedOn.getTime()) / DAY)),
    priority: t.priority ?? 'normal',
    assignee:
      typeof t.assignedTo === 'string'
        ? t.assignedTo
        : (t.assignedTo?.name ?? 'Unassigned'),
  };
}
```

Every `??` and every `typeof` in your application is now in this function. That
isn't tidiness — it means there's **one place to look** when someone asks why an
unassigned ticket says "Unassigned".

`now` is a parameter because a function that reads the clock can only be tested
by controlling the clock, and controlling the clock is a whole apparatus. Passing
it in makes the age calculation as testable as adding two numbers. **Time is
input, the same as the response is.**

## The sort that was hard

```ts
protected readonly rows = computed<TicketRow[]>(() => {
  const now = this.now();
  const rows = this.tickets().map((t) => toRow(t, now));

  return this.sort() === 'priority'
    ? [...rows].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    : [...rows].sort((a, b) => b.ageInDays - a.ageInDays);
});
```

with

```ts
const PRIORITY_ORDER = { high: 0, normal: 1, low: 2 } as const;
```

Both sorts are one line and neither one is interesting, because both are sorting
plain numbers. The `[...rows]` copy is there because `sort` mutates, and mutating
something a `computed` produced is a way to spend an afternoon.

The URL part is lab 04, unchanged: `sortBy` as a signal input, `null` to clear.

## Testing a border crossing

```ts
const NOW = new Date('2026-08-23T12:00:00Z');

it('produces the same age from either date format', () => {
  const iso = toRow(wire({ openedOn: '2026-08-13T12:00:00Z' }), NOW);
  const millis = toRow(wire({ openedOn: Date.parse('2026-08-13T12:00:00Z') }), NOW);

  expect(iso.ageInDays).toBe(10);
  expect(millis.ageInDays).toBe(millis.ageInDays);
});
```

No `TestBed`. No fixture. No fake timers. A function, two arguments, one
assertion.

**This is what "testable" actually means**, and notice you didn't do anything to
achieve it. You didn't add a test framework or a mocking library or an interface
with one implementation. You moved a decision into a function that takes what it
needs and returns what it produces. The testability is a side effect of the
shape.

Worth remembering the next time somebody proposes an abstraction *in order to*
make something testable.

## The venue entry

`venues/internal/view-models.md`:

```md
# View models

Data from an API is shaped for whoever built the API. Data for a screen is shaped
for the screen. When those differ — and they do — we write both down and one
function between them.

The view type has **no optionals and no unions**. If the screen shows it, the
type has it. Every `?` avoided here is a `??` the template doesn't contain.

The mapping function takes everything it needs as parameters, including the
current time. That keeps it a plain function, which is the only reason it's
pleasant to test.

Where this does NOT apply: if the wire shape and the screen shape are genuinely
the same, don't invent a second type to prove a point. The cost is real — two
types to change instead of one — and it's worth paying only when they actually
differ.
```

That last paragraph matters. A rule with no stated limit gets applied everywhere
by somebody eager, and then everyone hates it.
