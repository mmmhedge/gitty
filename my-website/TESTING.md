# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust
your instincts, and ship with confidence — without them, vibe coding is just yolo
coding. With tests, it's a superpower.

## Framework

[Vitest](https://vitest.dev) 3.x, running in the default `node` environment (no DOM
needed — see "What's tested" below).

## Running tests

```sh
npm test
```

## What's tested

This is a static, mostly-visual site (one Astro page, a WebGL shader, some canvas
icons). There's no business logic to speak of, so instead of testing nothing, the
data that drives the page — `PROJECTS`, `WRITING`, `CONTACT`, and the `ICONS` map —
was pulled out of the inline `<script>` into `src/lib/explore-data.ts` so it could
be tested directly.

`src/lib/explore-data.test.ts` covers:
- every card references an icon that actually exists in `ICONS` (this is the bug
  class that bit us once already — a typo'd icon name silently renders nothing)
- non-placeholder cards have a real `url`; placeholders have `url: null`
- no duplicate card names within a section
- contact links use the right scheme (`mailto:` for email, `https://` for the rest)
- every icon function draws without throwing, using a mock canvas context

The WebGL shader setup and DOM rendering (`renderGrid`, `showSection`, the liquid
shader itself) stay inline in `index.astro` and are verified visually — by running
the dev server and looking at it, or with `/design-review` — not with unit tests.

## Conventions

- One `describe` per logical group, `it` descriptions read as plain-English
  assertions ("every item references an icon that actually exists"), not
  implementation details.
- Prefer testing real invariants over `toBeDefined()`-style placeholder assertions.
- New cards added to `PROJECTS`/`WRITING`/`CONTACT` are covered automatically by
  the existing tests — no new test needed unless the shape of the data changes.
