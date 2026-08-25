# The setting two pages share

> **How this lab works.** The first part is the work. The second part is the
> answer guide, and it covers every step of the first part.
>
> Use it however suits you. Work through the first part and check yourself
> against the second. Read both together. Skip straight to the answers and type
> them in. Start on your own and bail out to the guide halfway through a step.
> All of those are fine and none of them are visible to anyone.
>
> **Nobody is grading you.** The point is to have built the thing and to have
> seen why it's built that way, and there's more than one road to that.

---

## What changed

Your timer works. Someone used it and came back with this:

> Twenty-five minutes is too short for me. I work in fifty-minute blocks. Can I
> set that?

Reasonable. And it's a bigger change than it sounds.

Right now the session length is a constant at the top of your component. To let
someone change it, there has to be somewhere to change it — a settings page —
and that page is a *different component* on a *different route*.

So the value has to be somewhere both of them can reach. That's the lab.

Your starter has the timer from last time. Sync it and run it.

## Try it where you are first

Before adding anything, spend sixty seconds trying to solve this without moving
anything.

Open `timer.ts`. The session length lives here:

```ts
const SESSION_SECONDS = 25 * 60;
```

Now imagine the settings page. It's a separate component. Write down — actually
write it — how it would change that constant.

You can't. Not because Angular is stopping you, but because there's nothing to
change. It's a module-level constant baked in when the file loaded, and even if
you made it a `let` and exported a setter, the timer read it once at construction
and would never hear about it.

**The value is in the wrong place, and the requirement is what proved it.** Not a
rule about services, not a best practice. A person asked for something and the
current arrangement can't deliver it.

## The part with no home

Go back to how we described this the first time. Six parts, and the first one was:

- **hold how much time is left**

That part belongs to the timer. It always did — the timer is the only thing that
cares how much of *this* session remains, and when the timer goes away that
number should go with it.

But the new requirement introduces a different part:

- **hold how long a session is**

Read those two next to each other. They sound similar and they aren't. One is
about a session in progress. The other is about the person's preference, which
is true whether or not a timer is running, and which two different pages need.

**Nothing in the timer component can hold the second one**, because the settings
page can't see inside a component. It needs its own place.

## Give it somewhere to live

Make a home for the session length that isn't inside either component.

It should:

- hold the number of minutes, as a signal
- offer a way to change it
- refuse anything that isn't a plausible session length

That last one is worth noticing while you do it. Nobody asked for it. Do it
anyway, and remember that you did.

> Answer: **"A place for it"**, in the guide below.

## Wire both pages to it

Two jobs:

**The timer** should get its starting time from the new home instead of the
constant, and `reset()` should use whatever the current setting is rather than a
fixed number.

**A settings page** — a new component on a `settings` route inside this lab —
should show the current value in a number input and write changes back.

Give each page a link to the other while you're in there.

> Answer: **"Wiring the two pages"**, in the guide below.

## Make it run

It won't, yet. You'll get an error in the console about a missing provider.

Fix it in `src/app/app.config.ts`, and then read the next step before you move
on, because that fix is the actual subject of this lab.

> Answer: **"The one word in app.config"**, in the guide below.

## The question nobody answered

Start the timer. Let it run down a bit. Now — while it's still running — go to
settings and change fifty to five.

Come back.

What did you expect to happen? What actually happened?

Sit with it for a moment before reading on. There's a question here that the
person who asked for this feature never answered, and neither did you.

> Answer: **"The question nobody answered"**, in the guide below.

## Write down what wasn't yours

Two of the things you just did came from Angular rather than from the
requirement. One of them should already be in `venues/angular-22.md` from
before. The other almost certainly isn't.

Work out which two, then add what's missing.

> Answer: **"What belonged to Angular"**, in the guide below.

## Last two questions

**One.** You now have two signals: one in the component and one in the new home.
Say out loud why each one is where it is. Then argue the opposite for both — what
would break if you swapped them?

**Two.** The session length currently lives as long as the application. Every lab
in this app shares one, forever, whether or not anyone visits the timer.

Is that right? What would you want instead, and what would have to change to get
it?

That's the next lab.

---

# The answer guide

Everything below is the same lab, with the answers in it.

Come here whenever you like — stuck, curious, short on time, or just because
you'd rather read than type today. Skipping ahead is not cheating, it's a
different way of learning the same thing, and the person who reads the answer and
understands it has not lost to the person who typed it.

## A place for it

`session-settings.ts`, next to your timer:

```ts
import { Injectable, signal } from '@angular/core';

@Injectable()
export class SessionSettings {
  readonly sessionMinutes = signal(25);

  setMinutes(minutes: number) {
    this.sessionMinutes.set(Math.max(1, Math.min(120, minutes)));
  }
}
```

Three things worth noticing, none of them ceremony:

- **It's a signal, same as in the component.** Moving state out of a component
  doesn't change what it is. The only thing that changed is who can reach it.
- **`setMinutes` clamps to 1–120.** Nobody asked for that. Hold on to it — it
  comes back in a later lab for a completely different reason.
- **`@Injectable()` with nothing inside it.** Not `providedIn: 'root'`, not
  `@Service`. That's deliberate and it's the subject of "The one word in
  app.config" below.

## Wiring the two pages

In `timer.ts`, replace the constant with an injection:

```ts
private readonly settings = inject(SessionSettings);

private readonly remaining = signal(this.settings.sessionMinutes() * 60);
```

and make `reset()` read the current setting:

```ts
protected reset() {
  this.running.set(false);
  this.remaining.set(this.settings.sessionMinutes() * 60);
}
```

The settings page, as `settings.ts`:

```ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionSettings } from './session-settings';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  template: `
    <div class="card bg-base-100 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Settings</h2>

        <label class="form-control">
          <span class="label-text">Session length (minutes)</span>
          <input
            class="input input-bordered"
            type="number"
            min="1"
            max="120"
            [value]="settings.sessionMinutes()"
            (change)="onChange($event)"
          />
        </label>

        <a class="link link-hover text-sm" routerLink="..">Back to the timer</a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Settings {
  protected readonly settings = inject(SessionSettings);

  protected onChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.settings.setMinutes(value);
  }
}
```

A link on the timer, inside the `card-body`:

```html
<a class="link link-hover text-sm" routerLink="settings">Settings</a>
```

And the route in `routes.ts`:

```ts
const routes: Routes = [
  { path: '', component: Timer },
  { path: 'settings', component: Settings },
];
```

## The one word in app.config

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  SessionSettings,
],
```

Now it runs. Go to settings, set fifty, come back to the timer. Fifty minutes.

**That one word is doing two jobs.**

The first you watched: without it, `inject(SessionSettings)` had nothing to give
you and the app died loudly. It makes the thing available. Obvious, and the error
told you.

The second one nothing has told you about. By putting it *there* — in the
application's config rather than anywhere else — you have said: **there is
exactly one of these, and it lives as long as the app does.** Both pages share it
because they're both inside the same application, not because of anything either
page does. Neither component asked to share. The sharing is a consequence of
where that word sits.

Nothing on your screen shows you that. You'll see it in the next lab, where the
word moves somewhere else and something changes.

## The question nobody answered

The running session keeps counting from where it was. It doesn't jump to five
minutes, and it doesn't reset.

That's because `remaining` was set when the component was built, and only
`reset()` reads the setting again.

Here's the thing: **that behaviour isn't wrong, but nobody chose it.** Go back to
the requirement. *"I work in fifty-minute blocks. Can I set that?"* It says
nothing about what should happen to a session already in progress.

So there's a part here that has to be filled and hasn't been:

- **decide what a length change does to a session already running**

Leave it alone, restart it, or something in between — all defensible. What you
can't do is not know. Right now the answer is whatever fell out of how the code
happened to get written, and the next person to touch this file will change it by
accident and never realise they decided anything.

You don't have to fix it. You do have to be able to say it out loud.

## What belonged to Angular

**`inject()`, not constructor parameters.** If you've used Angular before you'd
have written `constructor(private settings: SessionSettings)`. That still works.
We don't use it. This should already be in your venue file — check that it is.

**Where a service is provided.** This one probably isn't there yet. Add it:

```md
## We provide services explicitly

We do not use `providedIn: 'root'`, and we do not use the `@Service` decorator
Angular v22 suggests for new singletons. A bare `@Injectable()`, provided either
in `app.config.ts` or in a route's `providers` array.

The reason is that `providedIn: 'root'` decides lifetime and scope at the
*definition* site, and we want that decision made where the thing is used. One
service definition often needs different instances in different parts of an app,
and `root` can't express that without splitting the class.

Cost: you have to remember to provide it, and you find out you forgot at runtime.
```

That last line matters. A venue entry that only lists benefits is advertising.
The cost of this choice is the error you hit earlier, and it will happen to you
again.
