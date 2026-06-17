"""One-time manual login. Opens a real browser window; log in to X yourself,
then come back to the terminal and press Enter. Saves the session (cookies +
local storage) to auth/state.json so later runs can reuse it headlessly.
"""
import pathlib
from playwright.sync_api import sync_playwright

AUTH_DIR = pathlib.Path(__file__).resolve().parent.parent / "auth"
STATE_PATH = AUTH_DIR / "state.json"


def main() -> None:
    AUTH_DIR.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto("https://x.com/login")
        input("Log in in the opened browser window, then press Enter here...")
        page.context.storage_state(path=str(STATE_PATH))
        browser.close()
    print(f"Saved session to {STATE_PATH}")


if __name__ == "__main__":
    main()
