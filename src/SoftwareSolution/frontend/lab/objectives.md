# Lab

These are a list of objectives. Your job is to make them _reality_.

## Catalog

While viewing the catalog, there should be a way to hide the deprecated items. The API doesn't support this. Hidden should be the default.

We need a mechanism to filter the catalog by vendor. (just one vendor at a time).

## Vendors

Add a new area for working with vendors. It should be similar in form to the catalog - a list of vendors, and another route to add them.

The API mock is already there for you.

Here's a note from Claude when he generated that endpoint:

The body is nested: pointOfContact { name, email, phone }. The catalog form was two flat fields.
validation-error returns a ProblemDetails key of PointOfContact.Email, so mapping a server error onto a nested form field is the actual challenge, not just displaying a string.
normalized-url canonicalizes the URL server-side (acme.com → https://acme.com/). This is the scenario that fails visibly if a student adds the form model instead of the response body — the pessimistic-vs-optimistic distinction becomes something they can see rather than something you assert.

### Evaluate

Did you create a new store for the vendors? Should the Catalog area be using that store? Where did you provide that store and why?

## Auth

This is _fake_ auth, obviously but serves a purpose.

Anybody can see the catalog.

Only members of the help desk can add catalog items. The help desk manager can add vendors.

We need the links to be hidden for people that can't do things (don't show folks the vendors link or the catalog add if they don't have access).

Use route guards to make sure they can't get to those things if they have it bookmarked and aren't logged in.

https://angular.dev/guide/routing/route-guards

When the user logs out, they should be redirected back to the catalog list.

Look at https://ngrx.io/guide/signals/signal-store/events#defining-event-handlers

Any stores that are holding data should also empty their stores.
