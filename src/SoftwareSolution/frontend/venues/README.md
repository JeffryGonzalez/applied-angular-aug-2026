# venues

Each file here describes **a set of things that are available to us** — a
framework, a language, a platform, an agreement. Constraints are just what isn't
in the set; nobody writes "no."

**The rule for what goes in one:** only write down where we differ from what a
competent stranger would assume. Everything that matches the average is noise —
they were going to do that anyway.

That means these files are deliberately short and deliberately incomplete. A
venue file is not documentation and not a rulebook. It's the diff.

## How an entry is written

**Name the role first, then how we fill it.** Those are two different things and
only one of them is a preference.

- **The role** is the part that has to be filled by somebody. *Something has to
  decide how long this service lives and who shares it.* Every app fills that,
  including the ones where nobody realised they were filling it.
- **The casting** is how we fill it here. Explicit providers, in this case.

Written that way, an entry is useful somewhere it doesn't apply. You go back to
your own codebase and the question isn't *"are they doing it Jeff's way?"* — it's
**"is this role cast at all?"** Different casting is fine; different teams,
different constraints. **Nothing cast is a finding**, and often nobody knows,
because the decision got made by whoever typed first.

The version to avoid is *"this is just our style, you do you."* It sounds
generous and it teaches nothing, because it gives you nothing to check.

- `angular-22.md`, `css.md`, … — venues we adopted. Someone else owns them; we
  record what we do inside them.
- `internal/` — ours. Extensions, declines, and local agreements nobody
  published.

**These files did not start today.** They came out of the intro course, which is
why some of them answer questions you don't have yet. They'll grow this week —
several labs end by asking you to add something — and the folder is the part of
this repo worth taking back to work with you.

If you find code you can't account for, look for a venue file before you assume
it's a mistake. If there isn't one and the code cost you a moment, that's the
signal to write one.

## If you hit a word you don't know

This happens to everyone and it is the most common way to quietly fall behind:
you meet a term, you don't know whether it's the point or a detail, so you assume
it might be the point, and now you're solving the wrong problem while the room
moves on.

So:

1. **Check whether there's a venue file for it.** If there is, it's a thing we
   have opinions about, and the file will be short.
2. **If there isn't, it's almost certainly incidental** — background the lab is
   standing on rather than something the lab is about. Look it up if you want, or
   don't.
3. **Ask anyway.** Somebody else is wondering, and if a term is costing people a
   moment then it's a venue file that hasn't been written yet. That's a
   contribution, not an interruption.

Nothing in these labs depends on you already knowing every word in them.

