"""Reads the home timeline using a saved logged-in session. Read-only:
never clicks like/retweet/follow, only scrolls and reads the DOM.
"""
import pathlib
from dataclasses import dataclass

from playwright.sync_api import sync_playwright

AUTH_STATE = pathlib.Path(__file__).resolve().parent.parent / "auth" / "state.json"


@dataclass
class Tweet:
    author: str
    text: str
    url: str


class LoginExpired(Exception):
    pass


def scrape_timeline(scroll_passes: int, scroll_pause_ms: int) -> list[Tweet]:
    if not AUTH_STATE.exists():
        raise LoginExpired("No saved session — run scripts/login.py first.")

    tweets: dict[str, Tweet] = {}  # keyed by url, dedups across scrolls

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state=str(AUTH_STATE))
        page = context.new_page()
        page.goto("https://x.com/home", wait_until="domcontentloaded")

        if "/login" in page.url:
            browser.close()
            raise LoginExpired("Session expired — run scripts/login.py again.")

        page.wait_for_selector("article", timeout=15000)

        for _ in range(scroll_passes):
            articles = page.query_selector_all("article")
            for article in articles:
                _extract_tweet(article, tweets)
            page.mouse.wheel(0, 3000)
            page.wait_for_timeout(scroll_pause_ms)

        browser.close()

    return list(tweets.values())


def _extract_tweet(article, tweets: dict[str, "Tweet"]) -> None:
    link_el = article.query_selector("a[href*='/status/']")
    if not link_el:
        return
    href = link_el.get_attribute("href") or ""
    url = f"https://x.com{href}" if href.startswith("/") else href
    if url in tweets:
        return

    text_el = article.query_selector("[data-testid='tweetText']")
    text = text_el.inner_text() if text_el else ""

    user_el = article.query_selector("[data-testid='User-Name']")
    author = user_el.inner_text().split("\n")[0] if user_el else "unknown"

    if text.strip():
        tweets[url] = Tweet(author=author, text=text.strip(), url=url)
