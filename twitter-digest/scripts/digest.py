"""Main entrypoint: scrape -> filter -> summarize -> save. Run on a cron."""
import pathlib
import sys
from datetime import datetime

try:
    import tomllib
except ImportError:
    import tomli as tomllib

from filter import apply_filters
from scrape import LoginExpired, scrape_timeline
from summarize import summarize

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config.toml"
DIGESTS_DIR = ROOT / "digests"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        sys.exit(f"Missing {CONFIG_PATH} — copy config.example.toml and edit it.")
    with open(CONFIG_PATH, "rb") as f:
        return tomllib.load(f)


def main() -> None:
    config = load_config()

    try:
        tweets = scrape_timeline(
            scroll_passes=config["scrape"]["scroll_passes"],
            scroll_pause_ms=config["scrape"]["scroll_pause_ms"],
        )
    except LoginExpired as e:
        sys.exit(str(e))

    tweets = apply_filters(
        tweets,
        exclude_handles=config["filter"]["exclude_handles"],
        exclude_keywords=config["filter"]["exclude_keywords"],
    )

    summary = summarize(
        tweets,
        model=config["summarize"]["model"],
        max_tweets=config["summarize"]["max_tweets"],
    )

    DIGESTS_DIR.mkdir(exist_ok=True)
    out_path = DIGESTS_DIR / f"{datetime.now():%Y-%m-%d-%H%M}.md"
    out_path.write_text(f"# Digest — {datetime.now():%Y-%m-%d %H:%M}\n\n{summary}\n")

    print(summary)
    print(f"\nSaved to {out_path}")


if __name__ == "__main__":
    main()
