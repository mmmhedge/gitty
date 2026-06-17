import os

import anthropic

from scrape import Tweet

PROMPT_TEMPLATE = """Here are tweets from my X/Twitter home timeline, most \
recent first. Summarize what's happening: group into a few themes/stories, \
note anything that looks important or time-sensitive, and skip noise \
(memes, low-content replies) unless several accounts are discussing the \
same thing. Keep it skimmable — short headers and bullets, no fluff.

{tweets}
"""


def summarize(tweets: list[Tweet], model: str, max_tweets: int) -> str:
    if not tweets:
        return "No tweets to summarize."

    subset = tweets[:max_tweets]
    body = "\n".join(f"- @{t.author}: {t.text}" for t in subset)
    prompt = PROMPT_TEMPLATE.format(tweets=body)

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    response = client.messages.create(
        model=model,
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text
