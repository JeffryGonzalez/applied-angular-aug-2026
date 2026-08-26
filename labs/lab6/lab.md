# The response that lied

> Work half first, answer guide second. Switch whenever.

---

## The queue

New feature in your app: a ticket queue, fed by an actual HTTP call. Sync the
starter and run it.

Five tickets, everything in the right column. It works.

There's no server, by the way. `/api/*` is answered inside your browser — read
`venues/internal/the-api.md`, it's short and you'll need it in a minute.

## Change one word

Open `src/mocks/active-scenarios.ts`:

```ts
const activeScenarios: Record<string, string> = {
  '/api/tickets': 'typical',
};
```

Change `'typical'` to `'lying'`. Reload.

**Do not change any application code.** You aren't going to, all step.

## Where it broke, and where the mistake was

Open the console. You have an error, and it's pointing at your component —
somewhere around rendering a subject or an opened date.

Read the stack trace and then answer this: **is that where the mistake was
made?**

It isn't. The component did exactly what it was told with what it was given. The
mistake happened earlier, in a file that isn't in the stack trace at all, and the
error surfaced here because this is the first place anyone actually *touched* the
data.

Go and look at `tickets-api.ts` and see if you can spot the line that was wrong
the whole time — including five minutes ago, when everything worked.

> Answer: **"The line that was always wrong"**, in the guide below.

## Find out what actually arrived

Stop guessing. In the browser devtools, open the network tab and look at the
response body for `/api/tickets`.

Write down every way it differs from the `Ticket` interface in `wire.ts`. There
are more than three.

This is the step people skip, and it's the only one that produces knowledge. Ten
minutes of reasoning about *why* the component crashed is worth less than thirty
seconds of reading what the server sent.

> Answer: **"What actually arrived"**, in the guide below.

## Check it at the boundary

`zod` is already installed.

Write a schema in `wire.ts` that describes what the server **really** sends — not
what you wish it sent — and parse the response in `tickets-api.ts` before it goes
anywhere else.

Two things to get right:

- The schema describes **reality**, including the ugly parts. If `subject` can be
  null, say so.
- `TicketsApi` becomes the only place in the app allowed to believe the network.
  Everything downstream deals with data that's been checked.

The app will still be broken when you're done. That's expected — you'll have
moved the failure to somewhere honest.

> Answer: **"The schema"**, in the guide below.

## Make the component deal with what's true

Now the component has to handle a subject that can be null and an `openedOn`
that's sometimes a number.

Notice what changed about that work: you're no longer defending against the
unknown. You're handling cases the *type system now tells you exist*. Your editor
will not let you forget one.

> Answer: **"Rendering data you've checked"**, in the guide below.

## Two failures, not one

Switch the scenario again — this time to `error`. Then `missing`.

Your parse won't help, because nothing arrived to parse. **A server that's down
and a server that's changed shape are different problems**, and a person looking
at your screen needs to be told which one they've got.

Make the component say something different for each.

> Answer: **"Two failures"**, in the guide below.

## The decision you made without noticing

Look at how you handled `status`.

The docs say `open`, `waiting`, `closed`. The server sent `ARCHIVED`. You almost
certainly wrote `z.string()` and let it through, because that's what makes the
page work.

That was a choice, and there was another one: `z.enum(['open','waiting','closed'])`,
which **rejects the entire response** the moment an unknown status appears.

Neither is wrong.

- **Permissive** — the page keeps working, and you find out about `ARCHIVED`
  when a user asks why one row looks odd.
- **Strict** — you find out in thirty seconds, loudly, and nobody sees the page
  at all until it's dealt with.

Which one you want depends on things nobody has told you: how bad a wrong render
is here, who's on call, whether this is a dashboard or a billing screen.

**Write down which you chose and why, in one sentence.** You'll be asked for it,
not for the code.

## Write down what you learned about the venue

Two entries. Check what's already in `venues/` first — one of these files exists
and one doesn't.

> Answer: **"The venue entries"**, in the guide below.

## Last two questions

**One.** Your schema now says `subject` can be null. Somewhere in your app, that
null becomes `(no subject)` on the screen.

Which of those two things is the *wire* and which is the *view*? Are they in the
same file right now?

**Two.** Set the scenario to `empty` and reload. Then `slow`.

Neither of those is an error, and neither of them looks right. What's missing,
and who was supposed to have decided that?

---

# The answer guide

## The line that was always wrong

```ts
return firstValueFrom(this.http.get<Ticket[]>('/api/tickets'));
```

`http.get<Ticket[]>` is not a check. It's an **assertion** — you telling
TypeScript what to assume about a value nobody has looked at. TypeScript believes
you, stops worrying, and erases the whole thing before the code ever runs.

There is no moment at runtime where anything compares the response to `Ticket`.
There never was. That line was exactly as wrong when the page worked as it is
now; the only difference is that the server happened to be cooperating.

`venues/typescript.md` says this in one sentence: **a type is a claim, not a
guarantee.** This is what that costs when it's wrong.

And there's a sharper way to say it, which is worth carrying out of this lab.
You were standing in one venue and reaching for something that only exists in
another. **TypeScript is a venue that exists while you're writing. JavaScript is
the venue your code runs in.** At the moment you needed a check, TypeScript was
no longer present — it had been erased twenty minutes earlier by the build.

That isn't a gotcha, it's a lookup with an answer: *"can this venue give me what
my objective needs?"* No. So the objective needs a different venue — something
that inspects the value while the program is running. That's what a schema is.

`venues/javascript.md` is where that distinction lives, and it says the file is
deliberately incomplete — add to it when something surprises you. Something just
did.

## What actually arrived

Five rows. Four surprises:

| row | what happened |
|---|---|
| 4102 | `assignedTo` is an **object**, not a string. `priority` is **missing entirely**. |
| 4103 | `subject` is **null**. `openedOn` is a **number** — unix milliseconds — not an ISO string. |
| 4104 | `status` is `"ARCHIVED"`, which is not in the documented set. |

Every one of these is a thing real APIs really do. The object-instead-of-id
happens when someone "helpfully" expands a relation. The missing field happens
when a column is nullable and the serialiser omits nulls. The unix timestamp
happens when one endpoint was written by a different team.

## The schema

```ts
import { z } from 'zod';

export const TicketFromApi = z.object({
  id: z.number(),
  subject: z.string().nullable(),
  status: z.string(),
  openedOn: z.union([z.string(), z.number()]),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  assignedTo: z
    .union([z.string(), z.object({ id: z.string(), name: z.string() })])
    .nullable()
    .optional(),
});

export type TicketFromApi = z.infer<typeof TicketFromApi>;
export const TicketsFromApi = z.array(TicketFromApi);
```

and in `tickets-api.ts`:

```ts
async load() {
  const raw = await firstValueFrom(this.http.get<unknown>('/api/tickets'));
  return TicketsFromApi.parse(raw);
}
```

Note `get<unknown>`. Not `get<TicketFromApi[]>` — that would be the same
assertion again, wearing a nicer hat. You genuinely don't know what it is until
`parse` returns.

`z.infer` means the type comes *from* the schema. One description of the shape,
not two that can drift apart.

## Rendering data you've checked

```ts
protected readonly rows = computed(() =>
  this.tickets().map((t) => ({
    id: t.id,
    subject: t.subject ?? '(no subject)',
    status: t.status,
    openedOn: typeof t.openedOn === 'number'
      ? new Date(t.openedOn).toISOString()
      : t.openedOn,
    priority: t.priority ?? 'normal',
  })),
);
```

Nothing here is defensive. Every branch exists because the type says that case is
real, and if you delete one the compiler objects. **That's the difference between
guarding and knowing.**

## Two failures

```ts
function describe(e: unknown) {
  if (e instanceof HttpErrorResponse) {
    return e.status === 404
      ? 'That queue does not exist.'
      : `The ticket service is not answering right now (${e.status}). Nothing is wrong with your data.`;
  }
  if (e instanceof ZodError) {
    return 'The ticket service answered with something we do not recognise. This is a bug on our side or theirs, not a network problem.';
  }
  return 'Something went wrong loading tickets.';
}
```

Two failures that arrive at the same `catch` and mean completely different
things. One is somebody else's outage and there is nothing to do but wait. The
other means **the contract moved and our code is now wrong**, which is a bug with
an owner.

Telling a user "something went wrong" for both is how support tickets get filed
against the wrong team.

## The venue entries

`venues/internal/the-api.md` already exists — read it if you haven't. Add what you
learned about scenarios if it's missing anything.

`venues/javascript.md` already names the distinction and invites you to extend
it. Do that — write down what bit you today:

```md
## Things you have at dev time and not at runtime

| | |
|---|---|
| types and interfaces | gone entirely. Nothing to check against, ever. |
| `as Something` | a note to the compiler. Zero runtime effect. |
| generics | erased. `T` doesn't exist when the function runs. |
| `private`, `readonly` | compiler-enforced. At runtime it's a normal property. |
| optional (`field?`) | means *the compiler will make you check*. Nothing is checked. |

When a runtime decision depends on a shape, the answer is never a type. It's a
schema at the boundary, a discriminant the server actually sends, or a plain
function that looks at the value.
```

`venues/typescript.md` already says types are erased at runtime. What it doesn't
say is what to *do* about it. Add:

```md
## The boundary

Data from outside the program is `unknown` until something has checked it.
`http.get<Thing[]>()` is an assertion, not a check — it changes what the compiler
assumes and does nothing at runtime.

We parse with zod at the edge, in one place per endpoint, and derive the type
from the schema with `z.infer` so there's one description rather than two.

Cost: the schema has to describe what the server *actually* sends, which is
uglier than the documentation and needs updating when the API changes. You find
out it changed when the parse fails, which is the point.
```
