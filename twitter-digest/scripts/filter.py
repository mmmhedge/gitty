from scrape import Tweet


def apply_filters(tweets: list[Tweet], exclude_handles: list[str], exclude_keywords: list[str]) -> list[Tweet]:
    handles = {h.lower().lstrip("@") for h in exclude_handles}
    keywords = [k.lower() for k in exclude_keywords]

    kept = []
    for t in tweets:
        handle = t.author.lower().lstrip("@")
        if handle in handles:
            continue
        text_lower = t.text.lower()
        if any(k in text_lower for k in keywords):
            continue
        kept.append(t)
    return kept
