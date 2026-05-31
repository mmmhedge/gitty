# Consolidating your real work onto one account

Your contribution graph understates you because real work is scattered across
accounts, platforms, and private/org repos. Here's how to make that real work
visible on one central account — honestly, so it holds up to scrutiny.

Do these in order; the first two cost five minutes and usually recover the most
"missing" green.

## 1. Link every email you've committed with

GitHub credits a commit to your graph when the commit's **author email** is
verified on your account.

1. Go to **Settings → Emails → Add email address**.
2. Add every address you've ever committed with (personal, old, side-project).
   You can add many.
3. Verify each one.

This is **retroactive** — past commits authored with those emails start counting
once the email is verified. No history rewriting required.

> Find which emails your history actually used:
> ```bash
> git log --all --format='%aE' | sort | uniq -c | sort -rn
> ```

If you can no longer receive mail at an old verified-needed address, you can't
link it — mirror those repos instead (step 3).

## 2. Show your private & org contributions

Most "invisible" work is private. You can display it **without exposing any
code**:

1. On your profile, open the contribution-graph settings (the
   **Contribution settings** dropdown above the graph).
2. Enable **Private contributions**. Private work now shows as anonymized green.

For **org/work repos**: the org must allow members to surface contributions
(Org → Settings → Member privileges). If allowed, your real work there counts
on your graph automatically — **do not copy company code out**; you don't need
to, and you usually aren't permitted to.

## 3. Mirror your own personal repos from other accounts/platforms

For projects you own on a *different* personal account, GitLab, Bitbucket, or
just sitting in a local repo, bring the **real history** over:

```bash
scripts/mirror_repo.sh \
  https://gitlab.com/olduser/cool-project.git \
  https://github.com/your-gh-handle/cool-project.git
```

This preserves every commit's real author/date. Combined with step 1 (so the
author email is verified on your central account), those real commits light up
your graph with their **true** dates.

## 4. Pin the result

Once consolidated, pin 6 repos that best represent you
(**profile → Customize your pins**) and make sure each has a strong README
(see `templates/PROJECT_README.md`).

---

### Why not just fabricate commits?

It's tempting, but it backfires on the exact goal you have — a *credible*
central presence:

- Fabricated graphs have tells: unnatural uniform cadence, commits with empty or
  nonsensical diffs, activity that doesn't match repo timestamps.
- Anyone who clicks a green day sees the actual commits. Recruiters and
  engineers do click.
- It devalues the real work you're trying to showcase.

If you genuinely did the work, steps 1–3 surface it truthfully — and for someone
who works as much as you say, that fills the graph more completely than faking
ever would.
