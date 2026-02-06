# Quest Cards — Ideas & Future Features

## Current State (v0.4)

- ✅ Quest packs with challenges
- ✅ Family members (parents + kids)
- ✅ Points system
- ✅ Reward shops (per-parent)
- ✅ Quest queue
- ✅ Parent handoff flow
- ✅ Parents can do quests too
- ✅ Rewards can target anyone (including parents)

---

## Phase 2: Role Flexibility

### Kids Can Challenge Parents
**Status:** Planned

Let kids issue quests to parents for fun role-reversal:
- Kid creates challenge → assigns to Mom or Dad
- Parent does the quest
- **Kid approves** (they're the judge now!)
- Parent earns points

Creates bonding moments and teaches reciprocity.

### Self-Assigned Quests
**Status:** Partially built (auto-approves)

When you assign a quest to yourself:
- If you issued it to yourself → auto-complete on "I did it"
- If someone else issued it to you → normal approval flow

---

## Phase 3: Experiments Mode 🧪

### The Concept

Experiments are **ongoing behavioral trials**, not one-off tasks.

Inspired by quarterly personal experiments:
- "Two Mile Tuesdays" — run every Tuesday
- "Phone Sleeps Downstairs" — nightly habit
- "No-Spend Weekdays" — constraint-based

### How Experiments Differ from Quests

| Quests | Experiments |
|--------|-------------|
| One-off | Ongoing for a duration |
| Completed or not | Yields insights |
| Binary outcome | Check-in based |
| "Did you do it?" | "What did you learn?" |

### Experiment Lifecycle

```
1. Start experiment (set duration: 1 week / 1 month / 1 quarter)
2. Regular check-ins (yes/no + optional note)
3. End experiment (final check-in + "What's next?" prompt)
4. Insights captured, next experiment suggested
```

### Experiment Packs

**🏃 Fitness**
- Two Mile Tuesdays
- 10-Minute Morning Stretch
- Take the Stairs Always
- Workout Buddy Wednesdays

**📵 Digital Wellness**
- Phone Sleeps Downstairs
- No Screens After 9pm
- One-App Sunday
- Morning Airplane Mode

**💤 Sleep**
- Same Bedtime Every Night
- No Caffeine After 2pm
- 10pm Wind-Down Ritual
- No Screens in Bedroom

**💰 Money**
- No-Spend Weekdays
- Cash Only for Fun Money
- Buy Nothing New Month
- 24-Hour Purchase Rule

**🧘 Attention & Presence**
- 5-Minute Morning Meditation
- Single-Tasking Hour
- Phone-Free Meals
- Weekly Digital Sabbath

**💕 Relationships**
- Weekly Date Night
- Daily Gratitude Text
- One Genuine Compliment Per Day
- Tech-Free Family Dinner

### Experiment UI Elements

- **Check-in button** — Simple "I did it" / "I didn't" with optional note
- **Streak counter** — Visual motivation
- **End experiment** — Final check-in + "What's next?" prompt
- **Family visibility** — See what experiments everyone is running

---

## Phase 4: Parent Curation Tools

### Quest Backlog (Per-Child)

Parents browsing quest packs can:
- See which quests each kid has done
- **Save to backlog** — "Want to do this with Wyatt eventually"
- **Add notes** — "Wait until he's more comfortable in kitchen"
- Browse backlog when looking for next quest to assign

### Why This Matters

Different kids are at different stages:
- Eleanor knows how to cook eggs → not a quest for her
- Wyatt has never tried → goes in his backlog
- Parent can plan the **growth journey** for each child

### UI Concept

When viewing a quest:
```
┌─────────────────────────────────────┐
│ 🍳 Cook Scrambled Eggs              │
│                                     │
│ Eleanor: ✅ Completed               │
│ Wyatt:   ⬜ Not started             │
│                                     │
│ [Assign to Wyatt]  [Save for Later] │
└─────────────────────────────────────┘
```

Backlog view:
```
┌─────────────────────────────────────┐
│ 📋 Wyatt's Quest Ideas              │
│                                     │
│ 🍳 Cook Scrambled Eggs              │
│    Saved Jan 15 • "After he masters │
│    the microwave"                   │
│                                     │
│ 🧹 Load the Dishwasher              │
│    Saved Jan 20                     │
│                                     │
│ [Assign Now]  [Remove]              │
└─────────────────────────────────────┘
```

---

## Phase 5: Family View / The Arena

### Concept

A shared view showing what everyone is working on:

**Shows:**
- 🎯 Active quests (who's doing what right now)
- 🧪 Active experiments (ongoing trials)
- 🔥 Streaks (who's on a roll)
- 🏆 Recent wins (celebrations)

**Does NOT show:**
- ❌ Queued tasks (feels like to-do list)
- ❌ Overdue items (guilt-inducing)
- ❌ Chore assignments

### The Vibe

"Look at what our family is becoming" — not "Did everyone do their chores?"

---

## Future Ideas (Unprioritized)

- **Family Experiments** — Everyone does the same experiment together
- **Achievements/Badges** — Milestones for growth
- **Quest Templates** — Parents create reusable custom quests
- **Experiment Journal** — Browse past experiments and insights
- **Growth Timeline** — See a child's journey over time
- **Suggestion Engine** — "Based on what Emma has done, try this next"
- **Seasonal Packs** — Summer adventures, holiday traditions
- **Photo Evidence** — Optional photo with quest completion

---

## Technical Backlog

- [ ] Supabase migration (auth + database)
- [ ] Capacitor wrapper for iOS/Android
- [ ] Push notifications
- [ ] Family invite flow
- [ ] Data export

---

*Updated: 2026-02-06*
