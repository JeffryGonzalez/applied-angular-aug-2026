# Boundaries

**Anything provided in `app.config.ts` lives in `areas/shared/`.** A feature
folder that `app.config.ts` imports from is a feature you can no longer delete.

**Features don't import from each other.** If one needs something another has,
that thing moves to `areas/shared/` — as a decision, when the second caller
actually shows up, not in anticipation of one.

That's all you need right now. There's a whole convention underneath it — areas,
and a naming scheme that makes the dependency rules legible at a glance — and
it's written up properly here:
[Area-Based Project Structure](/courses/angular-dev/applied/07-architecture/01-area-structure)

## Nothing checks any of this

It's a convention held up by whoever happens to be reading the diff, which makes
it a preference rather than a boundary. Tools exist that turn the same rules into
build errors:
[Enforcing Boundaries with Sheriff](/courses/angular-dev/applied/07-architecture/02-sheriff)

You'll meet one later in the week, on a codebase that needs it.

## Why this app doesn't look like that

**This project is not an application. It's a collection of specimens.**

Each lab lives in `src/app/labs/<lab-name>/` and owns everything it needs, often
including a copy of something an earlier lab also had. In a real app that
duplication would be a defect. Here it's the point: any lab can be dropped,
reordered, or started cold without the ones around it caring.

So don't read this file tree as a recommendation.

## One thing that surprises people

The folder layout tells the bundler almost nothing. Two features being separate
directories doesn't make them separate chunks. Chunking follows **lazy route
boundaries**, not your file tree.

Structure is for the people reading it. If you want something in its own chunk,
that's a routing decision.
