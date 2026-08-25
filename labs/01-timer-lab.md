# The timer that ticks

## What we're building

Someone doing focused work wants to run a twenty-five minute session and see how
much of it is left. They need to be able to pause it and start it again, and to
put it back to the beginning.

That's it. That's the whole thing.

Before you write anything, read that paragraph again and notice what it does
**not** say. It says nothing about intervals, nothing about components, nothing
about signals. It's the thing somebody wants. Everything else is our problem.

Click below when you've read it.

## The venue

Before building anything, the first question is what's already available to us
and what that rules in or out.

Open `venues/` in your project and skim the files. Don't study them — you're
looking for the shape of what's there, not the contents.

Two things from `angular-22.md` matter for this lab:

- **We use signals for component state.** `signal()` for something that changes,
  `computed()` for anything derived from it.
- **We use inline templates and styles.** The `ngc` snippet does this for you —
  type `ngc` in an empty `.ts` file and tab through it.

If you last used Angular a few versions ago, that file is the fastest way to find
out what changed while you were away. You'll be adding to it later in this lab.

## The roles

Here is the same paragraph as a list of parts that have to be filled:

- **hold how much time is left**
- **show that time in a way a person can read** — `7:04`, not `424`
- **know whether we're currently counting**
- **make the time go down while we're counting**
- **start and stop the counting**
- **put it back to the beginning**

Six parts. Notice what's not on the list: there's no part for "warn me when I'm
nearly out of time," no part for "remember where I was if I close the tab," no
part for "play a sound at zero." Those are all reasonable things to want. Nobody
asked for them, so we're not building them.

Read the list against the paragraph and satisfy yourself that it covers it.

## Build it

Create `src/app/labs/the-timer-that-ticks/timer.ts` and paste this in.

```ts
import { Component, computed, effect, signal } from '@angular/core';

const SESSION_SECONDS = 25 * 60;

@Component({
  selector: 'app-timer',
  imports: [],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body items-center">
        <h2 class="card-title">Focus session</h2>

        <p class="font-mono text-7xl tabular-nums">{{ display() }}</p>

        <div class="card-actions">
          <button class="btn btn-primary" (click)="toggle()">
            {{ running() ? 'Pause' : 'Start' }}
          </button>
          <button class="btn btn-ghost" (click)="reset()">Reset</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Timer {
  private readonly remaining = signal(SESSION_SECONDS);
  protected readonly running = signal(false);

  protected readonly display = computed(() => {
    const total = this.remaining();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.running()) return;

      const id = setInterval(() => {
        this.remaining.update((s) => s - 1);
      }, 1000);

      onCleanup(() => clearInterval(id));
    });
  }

  protected toggle() {
    this.running.update((r) => !r);
  }

  protected reset() {
    this.running.set(false);
    this.remaining.set(SESSION_SECONDS);
  }
}
```

Then `routes.ts` in the same folder:

```ts
import { Routes } from '@angular/router';
import { Timer } from './timer';

const routes: Routes = [{ path: '', component: Timer }];

export default routes;
```

And one entry in `src/app/app.routes.ts`:

```ts
{
  path: 'the-timer-that-ticks',
  title: 'The timer that ticks',
  loadChildren: () => import('./labs/the-timer-that-ticks/routes'),
},
```

Run it. Start it, watch it count, pause it, reset it. Make sure it works before
you move on — the rest of this lab is about code that's already in front of you.

## Where the ticking comes from

Most people, told to make a number go down every second, reach for `setInterval`
and stop thinking. That instinct isn't wrong, but it leaves something out.

`setInterval` makes *time pass*. It doesn't make anything on screen change. What
puts a new number in front of the user is `remaining` being a signal — the
template reads it, so when it changes the template updates.

So the `effect` isn't "the Angular way to do `setInterval`." It's a bridge
between two different worlds: on one side, time passing, which Angular knows
nothing about; on the other, a signal changing, which is the only thing Angular
watches. The effect is where you stand with a foot in each.

That's also why the effect reads `running()` at the top. It isn't checking a
flag — reading the signal is what *subscribes* it. Flip `running` and this whole
block runs again.

## Break it on purpose

Comment out this line:

```ts
onCleanup(() => clearInterval(id));
```

Reload. Now: **Start, Pause, Start.** Watch the number.

It's counting down twice as fast. Pause and start once more and it's three times
as fast.

Work out why before reading on.

<details>
<summary>Why</summary>

Flipping `running` re-runs the effect, which calls `setInterval` again. The old
interval is still going. Now there are two, then three, each knocking a second
off. `onCleanup` runs before each re-run and shuts the previous one down.

</details>

Put the line back and confirm it behaves again.

## The half of that line you can't see

Here's the part that matters.

That one line was doing **two** jobs, and you only saw one of them.

The job you saw is ours. We put a Pause button on the screen, so the timer has to
survive being paused and started. Nobody wrote that down as a part — go back and
look at the list, it isn't there — but it follows from what we said we were
building. Fair enough.

The other job you can't see at all. When someone navigates away from this page,
the component is destroyed, but a `setInterval` doesn't care. It keeps firing
forever, knocking a second off a timer that no longer exists, in a component
nobody is looking at. `onCleanup` also runs on destroy, so that's handled too.

Nothing in our paragraph asked for that. Nothing in our list of parts implies it.
It's there because **we're building this in Angular**, and that's Angular's rule
about things you start inside an effect. If you deleted that line, our app
wouldn't visibly break — but you'd have broken Angular.

That's worth writing down, because it isn't about this timer and it'll be true
in every component you write for the rest of your career.

Open `venues/angular-22.md` and add this:

```md
## `effect` cleans up after itself

An `effect` can take an `onCleanup` callback, and Angular runs it **twice over**:
before the effect re-runs, and once more when the owning component is destroyed.

Worth knowing because those are two different jobs and only one of them is
usually visible. Skip it and a re-run stacks a second interval on top of the
first — you'll see that immediately. Skip it and navigate away, and the interval
keeps firing against a component nobody is looking at — you'll never see that
one, and it's the reason the callback exists.

Anything you start inside an effect that would outlive a single run belongs in
`onCleanup`: intervals, timeouts, subscriptions, event listeners, observers.
```

## Last two questions

Take two minutes on these. There's no submission — they're for you.

**One.** Look back at the six parts. Which lines of the code you pasted are there
because of one of them, and which lines are there for some other reason? You
should find at least three in the second group. For each one, what's it there
for?

**Two.** `SESSION_SECONDS` is `25 * 60`, sitting at the top of the file as a
constant. Somebody is eventually going to want to change it — to fifty minutes,
or to two minutes so they can test it without waiting.

Where would it have to live for that to be possible? You don't have to build it.
Just name the options and what each one costs.

Hang on to your answer to that second one. It's the next lab.
