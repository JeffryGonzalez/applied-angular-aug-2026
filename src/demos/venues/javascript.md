# JavaScript

**This is the venue your code actually runs in.** TypeScript is a venue that
exists only while you're writing. They are not the same set.

The question worth having as a reflex, and it is the whole entry:

> **Will this still be here at runtime?**

Types won't. Interfaces won't. `as Something` won't — it's a note to the
compiler and nothing else. All of it is erased by the build before a browser ever
sees it.

The one that catches people: **you cannot `instanceof` an interface.** There is
nothing to point at. If you need to know at runtime what something *is*, you need
something that inspects the value — a function, a schema, a field the server
actually sends.

Classes survive. `#private` fields survive. `enum` emits real code, which is why
it behaves differently from a union of string literals.

That list is incomplete on purpose. Add to it when something surprises you,
because the ones that surprise you are the ones worth writing down.
