## Testing

Run with `npm test` (vitest). Tests live in `src/lib/*.test.ts`. See TESTING.md for
what's covered and why.

Expectations:
- 100% test coverage is the goal — tests make vibe coding safe.
- When adding a new card to `PROJECTS`/`WRITING`/`CONTACT` in `src/lib/explore-data.ts`,
  the existing tests cover it automatically (icon-exists, url-shape, no-dup-names).
- When adding a new icon to `ICONS`, no new test is needed — the icon test iterates
  `Object.entries(ICONS)` automatically.
- Never commit code that makes existing tests fail.
