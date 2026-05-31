#!/usr/bin/env python3
"""Generate a GitHub profile README from a TOML config.

Usage:
    python3 scripts/build_profile.py [config.toml]

Reads the config (default: config.example.toml) and writes profile/README.md.
Drop that file into the special repo named after your handle
(github.com/<you>/<you>) and it becomes the banner on your profile page.

Only the Python standard library is used (tomllib, Python 3.11+).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError:  # pragma: no cover
    sys.exit("This script needs Python 3.11+ (for tomllib).")

ROOT = Path(__file__).resolve().parent.parent


def slug(text: str) -> str:
    """Lowercase simple-icons-style slug used for shields.io logos."""
    return re.sub(r"[^a-z0-9]", "", text.lower())


def badge(label: str, color: str = "0A0A0A") -> str:
    safe = label.replace("-", "--").replace(" ", "%20")
    return (
        f"![{label}](https://img.shields.io/badge/{safe}-{color}"
        f"?style=for-the-badge&logo={slug(label)}&logoColor=white)"
    )


def stat_cards(user: str, st: dict) -> str:
    theme = st.get("theme", "tokyonight")
    private = "true" if st.get("include_private", True) else "false"
    lines: list[str] = []
    if st.get("show_stats_card", True):
        lines.append(
            f'<img height="165" src="https://github-readme-stats.vercel.app/api'
            f"?username={user}&show_icons=true&theme={theme}"
            f"&count_private={private}&include_all_commits=true&hide_border=true\" />"
        )
    if st.get("show_streak", True):
        lines.append(
            f'<img height="165" src="https://github-readme-streak-stats.herokuapp.com/'
            f'?user={user}&theme={theme}&hide_border=true" />'
        )
    if st.get("show_top_langs", True):
        lines.append(
            f'<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/'
            f"?username={user}&layout=compact&theme={theme}"
            f'&count_private={private}&hide_border=true" />'
        )
    block = "\n".join(lines)
    if st.get("show_trophies", True):
        block += (
            f'\n\n<img src="https://github-profile-trophy.vercel.app/'
            f'?username={user}&theme={theme}&no-frame=true&column=7&margin-w=4" />'
        )
    return block


def project_card(p: dict) -> str:
    tags = " ".join(f"`{t}`" for t in p.get("tags", []))
    url = p.get("url", "")
    name = p.get("name", "project")
    head = f"**[{name}]({url})**" if url else f"**{name}**"
    return f"- {head} — {p.get('description', '').strip()}  \n  {tags}".rstrip()


def build(cfg: dict) -> str:
    idn = cfg.get("identity", {})
    about = cfg.get("about", {})
    contact = cfg.get("contact", {})
    skills = cfg.get("skills", {})
    projects = cfg.get("projects", [])
    stats = cfg.get("stats", {})

    user = idn.get("username", "your-gh-handle")
    name = idn.get("name", "Your Name")
    emoji = idn.get("avatar_emoji", "👋")

    out: list[str] = []

    # --- Header ---
    pron = f"  ·  *{idn['pronouns']}*" if idn.get("pronouns") else ""
    loc = f"  ·  📍 {idn['location']}" if idn.get("location") else ""
    out.append(f"<h1 align='center'>{emoji} Hi, I'm {name}</h1>")
    out.append(f"<p align='center'>{idn.get('tagline', '')}{pron}{loc}</p>")
    out.append(
        f'<p align="center">'
        f'<img src="https://komarev.com/ghpvc/?username={user}&style=flat-square&color=blue" '
        f'alt="profile views" /></p>'
    )
    out.append("")

    # --- About ---
    out.append("## About me")
    out.append("")
    if about.get("bio"):
        out.append(about["bio"].strip())
        out.append("")
    bullets = []
    if about.get("currently"):
        bullets.append(f"- 🔭 Currently: {about['currently']}")
    if about.get("learning"):
        bullets.append(f"- 🌱 Learning: {about['learning']}")
    if about.get("ask_me_about"):
        bullets.append(f"- 💬 Ask me about: {about['ask_me_about']}")
    if bullets:
        out.extend(bullets)
        out.append("")

    # --- Skills ---
    if any(skills.values()):
        out.append("## Tech I work with")
        out.append("")
        for group, color in (("languages", "0A0A0A"), ("frameworks", "1B1F23"), ("tools", "2D333B")):
            items = skills.get(group, [])
            if items:
                out.append(f"**{group.capitalize()}**  ")
                out.append(" ".join(badge(i, color) for i in items))
                out.append("")

    # --- Projects ---
    if projects:
        out.append("## Featured projects")
        out.append("")
        out.extend(project_card(p) for p in projects)
        out.append("")

    # --- Stats ---
    cards = stat_cards(user, stats)
    if cards.strip():
        out.append("## GitHub activity")
        out.append("")
        out.append('<p align="center">')
        out.append(cards)
        out.append("</p>")
        out.append("")

    # --- Contact ---
    links = []
    if contact.get("website"):
        links.append(f"[🌐 Website]({contact['website']})")
    if contact.get("linkedin"):
        links.append(f"[💼 LinkedIn]({contact['linkedin']})")
    if contact.get("twitter"):
        links.append(f"[🐦 Twitter](https://twitter.com/{contact['twitter']})")
    if contact.get("mastodon"):
        links.append(f"[🐘 Mastodon]({contact['mastodon']})")
    if contact.get("email"):
        links.append(f"[✉️ Email](mailto:{contact['email']})")
    if links:
        out.append("## Find me")
        out.append("")
        out.append(" · ".join(links))
        out.append("")

    out.append("---")
    out.append(
        "<sub>Profile generated with "
        "[gitty](https://github.com/your-gh-handle/gitty). "
        "Stats cards reflect real activity.</sub>"
    )
    out.append("")
    return "\n".join(out)


def main() -> None:
    cfg_path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "config.example.toml"
    if not cfg_path.exists():
        sys.exit(f"Config not found: {cfg_path}")
    with cfg_path.open("rb") as fh:
        cfg = tomllib.load(fh)

    out_path = ROOT / "profile" / "README.md"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(build(cfg), encoding="utf-8")
    print(f"Wrote {out_path.relative_to(ROOT)}")
    print("Next: copy it into github.com/<you>/<you> as README.md")


if __name__ == "__main__":
    main()
