# twitter-digest

Summarizes your X/Twitter home timeline without giving any agent or API key
write access to your account, and without paying for the X API.

How it works: a headless browser reuses your **own logged-in session**
(cookies saved locally, once) to read your timeline, same as opening
twitter.com in a browser tab. Nothing is posted, liked, followed, or
modified — read-only DOM scraping. Tweets are filtered through a local
exclude list (accounts/keywords you don't want in your digest — handled
entirely on your machine, not on X), then summarized by an LLM.

**Note:** this automates a logged-in browser session, which is against X's
Terms of Service (their automation rules require the official API for any
automated access). Personal-scale use (one run every few hours) is low
signature, but understand the risk: X can flag/lock an account it
suspects of automation. Use a session you're comfortable putting at risk,
not one you can't afford to lose.

## Setup

```bash
pip install -r requirements.txt
playwright install chromium

cp config.example.toml config.toml   # edit exclude list, schedule
python3 scripts/login.py             # opens a browser, log in manually, then press Enter
```

`login.py` saves your session to `auth/state.json` (gitignored — never commit
this file, it's equivalent to your login session).

## Run a digest

```bash
export ANTHROPIC_API_KEY=...   # for the summarizer
python3 scripts/digest.py
```

Prints a summary to stdout and writes it to `digests/YYYY-MM-DD-HHMM.md`.

## Automating it

This intentionally has no built-in scheduler — run it however fits your
machine:

```bash
# crontab -e
0 9,13,18 * * * cd /path/to/twitter-digest && /usr/bin/python3 scripts/digest.py >> digest.log 2>&1
```

Don't run this on a shared/CI server with your cookies as a secret — keep
`auth/state.json` local to a machine you control. Sessions expire
periodically; if `digest.py` reports a login failure, re-run `login.py`.

## Curating your digest (without touching your real account)

Edit `config.toml`:

```toml
[filter]
exclude_handles = ["someaccount", "anotherone"]
exclude_keywords = ["crypto giveaway"]
```

Mutes/unfollows here only affect what reaches your digest — your actual X
account and follow graph are untouched.
