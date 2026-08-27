# The write that failed later

> **Twenty minutes.** You'll build the same feature three times. That's the lab —
> the comparison is the lesson, and no single one of the three is the answer.
>
> Work half first, answer guide second.

---

## What you have

A ticket queue with an assignee dropdown. Changing it saves to the server.

Everything so far in this course has been *reading*. This is the first time
you've changed something that isn't yours.

Run it and assign a ticket. It works.

## Version one: wait for permission

Read what the starter does when you change a dropdown.

It disables the control, shows a spinner, waits for the server, and only then
updates the screen. If the server refuses, nothing on screen ever moved.

**This version is completely honest.** What you see is what the server has
agreed to. There is no moment where the screen claims something untrue.

Now set the write scenario to `slow` in `src/mocks/active-scenarios.ts`:

```ts
'/api/tickets/:id/assignee': 'slow',
```

Assign three tickets in a row. Time it.

That honesty costs seven and a half seconds of somebody's life, three times a
minute, all day. **It is correct and people hate it.**

## Version two: believe it, then check

Change the code so the screen updates immediately and the server is told
afterwards. If the server refuses, put it back and say something.

Set the scenario to `fails` and try it. The row changes, then changes back, and a
message appears. Fast when it works, honest when it doesn't.

This is the version most applications ship.

> Answer: **"Believing it early"**, in the guide below.

## Now break it properly

Set the scenario to `fails-late`. That's a refusal that takes two and a half
seconds to arrive.

Then do this exactly:

1. Change an assignee.
2. **Immediately** navigate to another lab using the top nav.
3. Wait five seconds.
4. Come back.

What did the user get told?

Nothing. Nothing at all.

Sit with that before you read on, because it's worse than it looks. Work out
*why* nothing happened — not what you'd do about it.

> Answer: **"Where the failure went"**, in the guide below.

## Version three: put the write somewhere it can survive

The problem isn't optimism. It's that the only thing that knew about the write
was a component, and the user destroyed it by clicking a link.

So the write needs to live somewhere that isn't a page.

Build it:

- A service holding a list of writes in flight, each with a ticket, an assignee,
  a label a person can read, and a state.
- The service — not the component — talks to the API and records what happened.
- A small tray, rendered by the **lab's shell** rather than by any page, showing
  what's in flight and what failed.
- Failed writes offer **Retry** and **Dismiss**.

Then do the same four steps. Change, leave, wait, look.

> Answer: **"An outbox"**, in the guide below.

## Where it has to be provided

Your outbox will only work if it outlives the page.

You already know how to arrange that — you spent a whole lab on it. Put it in the
right place and be able to say why that place and not the other two.

> Answer: **"Where it lives"**, in the guide below.

## The comparison

Fill this in yourself before reading the guide's version:

| | feels | truthful | survives leaving |
|---|---|---|---|
| wait for permission | | | |
| believe it early | | | |
| outbox | | | |

Then the real question: **when would you still ship version one?**

There is a good answer and it isn't "never."

> Answer: **"When each one is right"**, in the guide below.

## Write it down

One venue entry, `internal/`.

> Answer: **"The venue entry"**, in the guide below.

## Last two questions

**One.** Your outbox holds writes in memory. Close the tab with one pending and
it's gone — the user was told it was sending, and then there was no tab.

Is that acceptable? For assigning a ticket? For submitting an expense claim? For
a payment?

**Two.** Two people assign the same ticket to different agents at the same time.
Both screens update immediately. Both writes succeed.

What does each person now believe, and which one is wrong?

---

# The answer guide

## Believing it early

```ts
protected async assign(id: number, event: Event) {
  const name = (event.target as HTMLSelectElement).value;
  const before = this.tickets();

  // believe it immediately
  this.tickets.update((all) =>
    all.map((t) => (t.id === id ? { ...t, assignedTo: name } : t)),
  );

  try {
    await this.api.assign(id, name);
  } catch {
    this.tickets.set(before);
    this.error.set(`Ticket ${id} could not be assigned. Put back.`);
  }
}
```

Keeping `before` is the whole trick, and it's why optimistic updates need the
previous state rather than an "undo" — you aren't reversing an operation, you're
restoring a value.

## Where the failure went

The `catch` ran. It really did.

`this.tickets.set(before)` set a signal on a component that no longer exists, and
`this.error.set(...)` wrote a message into a template that was destroyed two
seconds earlier. Both succeeded. Nobody saw either.

**The failure didn't vanish — it arrived somewhere nobody was standing.**

This is the same shape as lab 01, and it's worth noticing. There, an interval
kept firing into a destroyed component and the fix was to stop it. Here, a
*response* arrives at a destroyed component, and stopping it is the wrong fix.
The user still needs to know.

**A write outlives the screen that started it.** That's the sentence. Everything
else in this lab follows from it.

## An outbox

```ts
export interface PendingWrite {
  id: string;
  ticketId: number;
  assignedTo: string;
  label: string;
  state: 'sending' | 'failed';
  message?: string;
}

@Injectable()
export class Outbox {
  private readonly api = inject(TicketsApi);

  private readonly writes = signal<PendingWrite[]>([]);
  readonly pending = this.writes.asReadonly();
  readonly busy = computed(() => this.writes().some((w) => w.state === 'sending'));

  private nextId = 0;

  assign(ticketId: number, assignedTo: string, label: string) {
    const id = `w${this.nextId++}`;
    this.writes.update((all) => [...all, { id, ticketId, assignedTo, label, state: 'sending' }]);

    this.api
      .assign(ticketId, assignedTo)
      .then(() => this.settle(id))
      .catch((e) => this.fail(id, e?.error?.message ?? 'That did not save.'));

    return id;
  }

  // retry, dismiss, settle, fail — small and boring
}
```

Note `label`. The outbox talks to a person, so it carries the name as well as the
id — the same split as `assignee` and `assignedToId` in your view model. An
outbox that says *"Ticket 4103 → a-1 failed"* is technically correct and useless.

The tray goes in the **shell**, not in a page:

```html
<app-outbox-tray />
<router-outlet />
```

That's the entire mechanism. The tray is outside the thing you navigate away
from, so navigating away doesn't touch it.

## Where it lives

The route's `providers`, on the lab's parent route — above the pages, below the
application.

Not in the component: that's what we're fixing.

Not in `app.config.ts` either, and this is the interesting one. It would work.
But an outbox that lives as long as the app means a failed ticket assignment is
still sitting in the tray on Thursday, in a completely different part of the
product, with no context. **Scope it to the thing it's about.**

You worked out how to make that choice in `where-you-provide-it`. This is the
same decision with real stakes.

## When each one is right

| | feels | truthful | survives leaving |
|---|---|---|---|
| wait for permission | slow, safe | always | n/a — you couldn't leave |
| believe it early | fast | usually | no |
| outbox | fast | always | yes |

**You still ship version one when being wrong is expensive.** Deleting an
account. Submitting a payment. Anything where showing "done" and then taking it
back is worse than making someone wait. A spinner is a cheap price for never
lying.

Optimism is a bet that the write will succeed. It's a good bet — that's why it
feels fast. **The outbox isn't a third strategy; it's optimism plus somewhere to
put the losses.**

## The venue entry

`venues/internal/writes.md`:

```md
# Writes

Reads can be re-run. Writes cannot, and a write outlives the screen that started
it. A user who clicks a link two seconds after saving is still owed the outcome.

Optimistic by default: update immediately, keep the previous value, restore it if
the server refuses.

Anything that can fail after the user has moved on goes through the outbox, which
is provided on the route that owns the work — not in a component (which dies) and
not app-wide (which makes an unrelated screen carry an unrelated failure).

Failed writes show what failed, in words a person can read, with a way to try
again or let it go.

**Wait for the server instead when being wrong is expensive.** Payments,
deletions, anything irreversible. A spinner is cheap; lying is not.

Currently in memory only. A pending write does not survive closing the tab, and
nobody has decided whether that's acceptable.
```

That last line is doing real work. It's not an apology — it's a known gap, stated
where the next person will find it, so it gets decided on purpose rather than
discovered during an incident.
