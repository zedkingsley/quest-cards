# Quest Cards — Decision Log

## Decision Framework

When making decisions autonomously, consider:
1. **User Persona** — What would Zed/Alex/Eleanor/Wyatt want?
2. **Business** — Does this help get to App Store?
3. **Technical** — Is this maintainable? Does it scale?
4. **Design** — Is this intuitive? Delightful?
5. **Pragmatic** — Can we ship this today?

---

## 2026-02-05: Family Challenge Mode Build

### D1: Family PIN for MVP
**Decision:** Simple 4-digit PIN stored on Family object, verified before parent-only actions
**Why:** Real accounts are Phase 3 (Supabase). PIN is enough friction to prevent kids from self-approving.
**Trade-off:** Not secure against determined kids, but that's fine for family trust model.

### D2: Points as IOUs
**Decision:** Points come from issuer's "wallet," redeemable only at their reward shop
**Why:** P2P-ready architecture. When friends challenge each other later, points flow naturally.
**Trade-off:** More complex than global points pool, but better long-term.

### D3: Per-Person Reward Shops
**Decision:** Each parent maintains their own reward shop. Kids see combined view filtered by availability.
**Why:** Different parents might offer different rewards. Reflects real family dynamics.

### D4: Default Rewards Auto-Created
**Decision:** When a parent is added, create starter rewards (allowance, screen time, etc.)
**Why:** Reduces friction. Parents can edit/delete, but have something to start with.

---

## 2026-02-05: Feedback Round 1 Refactor

### D5: 4-Tab Navigation
**Decision:** Remove Family tab. New nav: Home | Challenges | Shop | Settings
**Why:** Family management is infrequent. Settings is the right home for it.
**Critique:** Fewer taps to get there? No - settings is one tap away.
**Result:** Cleaner, more focused navigation.

### D6: Header Avatar Picker
**Decision:** Clicking avatar in header opens member switcher modal (not dropdown)
**Why:** Modal gives big tap targets, shows full info (name, points, role).
**Critique:** Modal might feel heavy. Counter: it's quick to dismiss, and clear who you're switching to.
**Result:** Removes awkward "Who's playing?" section from home, cleaner UX.

### D7: Kids Start Their Own Quests
**Decision:** Children can browse packs and start challenges for themselves. No parent approval to START, only to COMPLETE.
**Why:** Kids have agency. They choose their own adventure. Parents approve the work, not the choice.
**Critique:** What if parents want to control available quests? Counter: That's a future feature (quest allowlists). For now, trust the family.
**Result:** More engaging for kids, less work for parents.

### D8: Parent Quest Assignment Flow
**Decision:** When parent views a pack challenge, "Assign to..." button opens child picker. No more auto-assigning to first child.
**Why:** Previous flow was confusing. New flow is explicit about who gets the quest.
**Critique:** Extra tap. Counter: Clarity is worth one tap.
**Bug Fixed:** Parents couldn't start quests when viewing as themselves because code tried to auto-assign to undefined.

### D9: Pack Customization (Deferred)
**Decision:** Defer "parents can add/edit pack challenges" to next iteration.
**Why:** Complex feature, needs proper data model. Current "Issue Challenge" covers custom challenges.
**What's Next:** Add this in Round 2, with proper custom challenge storage and pack editing UI.
