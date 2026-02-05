# IDEAS.md - Quest Cards

Parking lot for product ideas. Not committed — just captured.

---

## 1. Custom Tasks / Parent-Created Challenges

**Problem:** Parents want to add their own challenges. Also solves "can kids redo challenges?"

**Idea:**
- Built-in packs are read-only
- Parents get a "My Pack" (custom, editable)
- "Copy to My Pack" button on any challenge
- Can tweak reward/instructions when copying
- Can create fully original challenges too

**Later:** Share custom packs with other families

---

## 2. Audience Tags > Age Ranges

**Problem:** Explicit age ranges ("Ages 4-7") might turn off older kids or feel limiting.

**Idea:** Replace age with *vibe* labels:

| Vibe | Roughly... |
|------|-----------|
| 👶 Little Legends | 3-5 |
| ⚔️ Adventurers | 6-9 |
| 🎯 Challengers | 10+ |
| 🌙 Side Quest Energy | Teens |
| 👥 Squad Goals | Social/group |
| 💪 Sweat Unlocked | Fitness |
| 🌍 All Players | Everyone |

Could be tags (multiple per challenge) rather than single labels. Filter in search, but cards just show fun badges.

---

## 3. Points Economy

**Current:** Challenges show direct dollar rewards ($2, $5, etc.)

**Problem:** Inflexible. No "save up" mechanic. Can't do non-money rewards easily.

**Options:**

### A. Keep Direct Rewards
Simple, transparent. Current approach.

### B. Full Points System
- Challenges award points (30 pts, 50 pts)
- Parent sets conversion: "100 points = $10"
- Parent creates "Reward Shop" with items/experiences
- Kid sees balance, browses rewards

### C. Hybrid (Recommended for next phase)
- Rename current rewards to "points"
- Add setting: `10 points = $1`
- Parents can add custom rewards later
- Best of both without full shop yet

---

## 3b. Social Points / Reputation (Future)

**Wild idea:** What if challenge creators issue their own currency?

- I create a challenge → you complete it → you earn "Zed points"
- Points redeemable... from me? For what?
- Needs trust/verification mechanics
- Could work for: friend groups, classrooms, teams, creators

**Complexity:** High. Phase 3+ at earliest. But keep data model flexible (challenges could have `creator_id`).

---

## 4. Mobile App Path

**Decision:** Go with Capacitor (Option 2)

- Wrap existing Next.js app in native shell
- Same codebase for web + iOS + Android
- Real App Store presence
- Keep 95% of current code

**Steps:**
1. Finish iterating on web app
2. Add Supabase (auth + database)
3. Wrap with Capacitor
4. Publish to App Store

---

## Open Questions (from DECISIONS.md)

Still need Zed's input:

- [ ] One active quest at a time, or allow multiple?
- [ ] Reward amounts ($1-5) — right range?
- [ ] Add streak tracking?
- [ ] App name "Quest Cards" — keep it?

---

*Last updated: 2026-02-05*
