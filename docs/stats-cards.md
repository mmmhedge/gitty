# Live stats cards reference

These render your **real** GitHub activity as images you can embed anywhere
(profile README, project READMEs). They update automatically. `build_profile.py`
wires them up for you; this is the reference if you want to hand-tune.

Replace `USER` with your handle and `THEME` with any
[github-readme-stats theme](https://github.com/anuraghazra/github-readme-stats/blob/master/themes/README.md)
(e.g. `tokyonight`, `radical`, `dracula`, `github_dark`).

### Stats summary
```md
![stats](https://github-readme-stats.vercel.app/api?username=USER&show_icons=true&theme=THEME&count_private=true&include_all_commits=true&hide_border=true)
```
- `count_private=true` includes private-repo contributions (needs the
  "Private contributions" setting on — see `consolidation.md`).
- `include_all_commits=true` counts all commits, not just the last year.

### Streak
```md
![streak](https://github-readme-streak-stats.herokuapp.com/?user=USER&theme=THEME&hide_border=true)
```

### Top languages
```md
![top langs](https://github-readme-stats.vercel.app/api/top-langs/?username=USER&layout=compact&theme=THEME&count_private=true&hide_border=true)
```

### Trophies
```md
![trophies](https://github-profile-trophy.vercel.app/?username=USER&theme=THEME&no-frame=true&column=7&margin-w=4)
```

### Profile view counter
```md
![views](https://komarev.com/ghpvc/?username=USER&style=flat-square&color=blue)
```

### Snake animation (optional, needs a GitHub Action)
A contribution-graph "snake" that eats your squares. Add the
[Platane/snk](https://github.com/Platane/snk) action to your profile repo, then:
```md
![snake](https://raw.githubusercontent.com/USER/USER/output/github-contribution-grid-snake.svg)
```

> These third-party renderers read only your public data (plus aggregate
> private counts you opt into). They can't post or change anything on your
> account.
