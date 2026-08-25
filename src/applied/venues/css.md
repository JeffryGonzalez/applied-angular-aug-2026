# CSS

**You are not here to learn CSS.**

That's the whole entry, and it's a real position rather than an apology. If it
helps, read every `class="..."` in these labs as `class="makes-it-pretty"` and
move on. Nothing in this course turns on whether you understood a utility class,
and no exercise will ask you to.

The reason there's any styling at all is that a screenshot of unstyled HTML is a
poor thing to show anyone on Friday.

## What we're using

**Tailwind** — utility classes rather than authored stylesheets. `flex`, `gap-4`,
`text-7xl`, `p-6`. Each one does one thing and the name tells you what.
https://tailwindcss.com/docs

**daisyUI** — components built on Tailwind. `btn`, `card`, `badge`, `menu`,
`join`. Where you see a class that reads like a *thing* rather than a property,
it's daisyUI. https://daisyui.com/components/

Global styles are `src/styles.css`, and it's two lines long.

## What this means for us

We don't write CSS files. Components carry `styles: ``` — empty and staying
empty. If something needs to look different, it's a class in the template.

If you go back to a codebase with hand-written stylesheets, none of this
transfers and none of it was meant to. This is a venue we chose so that a
different subject could have your attention.
