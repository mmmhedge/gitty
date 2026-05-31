# gitty

A small toolkit for building a strong, **central** GitHub presence — a profile
that ties together work scattered across accounts, platforms, and private repos,
and shows it off well.

Built to be run against your main account. Everything here surfaces *real*
activity; nothing fabricates it (see [the note below](#a-note-on-fake-commits)).

## What's in here

| Piece | What it gives you |
|-------|-------------------|
| `scripts/build_profile.py` | Generates a polished profile README from one config file. |
| `config.example.toml` | The config you edit — identity, bio, skills, projects, stats. |
| `profile/README.example.md` | Sample of the generated output. |
| `scripts/mirror_repo.sh` | Mirror your real repos (any platform) onto your central account, full history preserved. |
| `docs/consolidation.md` | Make scattered + private work count on one contribution graph. |
| `docs/stats-cards.md` | Live stats/streak/language/trophy cards reference. |
| `templates/PROJECT_README.md` | Drop-in README for your pinned projects. |

## Quick start

```bash
# 1. Build your profile banner
cp config.example.toml config.toml      # edit with your details
python3 scripts/build_profile.py config.toml
#    -> writes profile/README.md

# 2. Publish it: create a repo named exactly after your handle
#    (github.com/<you>/<you>) and commit profile/README.md as its README.md.
```

Then work through `docs/consolidation.md` to make your real activity visible on
one account.

## Recommended order

1. **Profile README** — your front page. `build_profile.py`. (5 min)
2. **Link your emails** — retroactively credits past commits. `docs/consolidation.md` §1. (5 min)
3. **Show private contributions** — lights up org/work activity, no code exposed. §2. (1 min)
4. **Mirror personal repos** from other accounts/platforms. `mirror_repo.sh`. §3.
5. **Pin + polish** 6 repos with `templates/PROJECT_README.md`. §4.

## A note on fake commits

This toolkit deliberately does **not** generate synthetic/backdated commits to
pad your graph. The goal is a *credible* central presence, and a fabricated
graph undercuts exactly that — it's detectable (uniform cadence, empty diffs,
mismatched timestamps) and anyone can click a green day to see the commits.

If the graph understates you, it's because real work is invisible, not absent.
`docs/consolidation.md` makes that real work show up truthfully — which, if you
work as much as you do, fills the graph more than faking ever would.

## Requirements

- Python 3.11+ (standard library only)
- git, bash (for the mirror script)
