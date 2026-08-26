# TypeScript

Angular is written in TypeScript, and a good half of the confusion people bring
to Angular turns out to be TypeScript confusion wearing an Angular costume. Worth
being able to tell which is which — when something surprises you, the first
question is *"is this Angular, or is this the language?"*

## The one that catches everyone

**TypeScript types are gone at runtime.** All of them. They are checked while you
compile and then erased — nothing in the running browser knows what a `Ticket`
is.

Which means a type is a *claim*, not a guarantee. If you say data from a server
is a `Ticket` and it isn't, TypeScript has already agreed with you and gone home.
Nothing checks. You find out somewhere unrelated, later.

The full list of what does and doesn't survive is in `venues/javascript.md` —
worth a read once, and worth re-reading the first time something surprises you at
runtime.

## Structural, not nominal

If it has the right shape, it *is* the type. There's no declaring that a class
implements something — matching is enough. If you're coming from C# or Java this
is the difference that will bite you, and it isn't a worse version of what you
know, it's a different idea.

## Where to look

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

If TypeScript is the thing in this stack that feels most foreign to you, that's
worth knowing about yourself. It's usually where the friction is.
