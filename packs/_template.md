# Challenge Pack Template

Use this format for creating new challenge packs.

---

## Pack Metadata

```yaml
slug: pack-slug-here
name: Pack Display Name
description: Short description of what this pack is about
icon: 🎯
category: mixed | creative | life-skills | learning | adventure | social
age_min: 4
age_max: 10
```

## Challenge Format

```yaml
- slug: challenge-slug
  title: Challenge Title
  description: Short kid-friendly description (1-2 sentences)
  instructions: |  # Optional - more detailed steps
    1. First do this
    2. Then do that
    3. Finally, this
  icon: 🎨
  difficulty: easy | medium | hard
  reward_type: money | experience | choice
  reward_value: "$3" | "Pick a movie" | "30 min extra screen time"
  time_estimate: "15 minutes" | "1 hour" | "1 week"
```

## Guidelines

1. **Keep descriptions short** - Kids don't read walls of text
2. **Use active verbs** - "Draw a monster" not "Monster drawing activity"
3. **Make success clear** - How do they know when they're done?
4. **Reward should match effort** - Hard challenges = better rewards
5. **Be specific but flexible** - "Draw any animal" not "Draw a cat"
