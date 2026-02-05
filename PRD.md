# Quest Cards — Product Requirements Document

> **Last Updated:** 2026-02-05  
> **Status:** MVP Complete → Active Development  
> **Repo:** [github.com/zedkingsley/quest-cards](https://github.com/zedkingsley/quest-cards)

---

## For AI Agents Working on This Project

This PRD is the canonical source of truth for Quest Cards. Before making architectural decisions, building features, or refactoring code:

1. **Read this entire document** — understand the vision, not just the current task
2. **Check the Roadmap** — know what's coming so you don't paint us into corners
3. **Respect the Data Model guidance** — keep schemas flexible for future features
4. **When in doubt, ask** — or leave a note in DECISIONS.md

The goal is a shipped App Store product, not a perfect prototype.

---

## 1. Product Vision

### What Is Quest Cards?

Quest Cards reimagines allowance as adventure. Instead of passive chores or vague expectations, kids **choose** challenges from themed packs, complete them in real life, and earn rewards when a parent verifies.

It's the "challenge card" metaphor made digital — like trading cards, but for growth.

### Who Is It For?

**Primary Users:**
- **Parents** who want to encourage independence, growth, and intentional play
- **Kids (ages 4-14)** who want agency and rewards

**Use Cases:**
- Replacing traditional allowance with engagement
- Encouraging new skills (cooking, art, problem-solving)
- Family bonding through shared challenges
- Gamifying household contributions without nagging

### Core Philosophy

| Principle | What It Means |
|-----------|---------------|
| **Agency over Assignment** | Kids pick their challenges — they're not told what to do |
| **Adventure over Chores** | Frame everything as quests, not work |
| **Simple for Parents** | Minimal setup, verification takes seconds |
| **Fun for Kids** | Satisfying interactions, visual rewards, progression |
| **Flexible Rewards** | Points, money, experiences — parent decides |

---

## 2. Current State (MVP)

### What Exists

A fully functional web app with:

- **Kid Profiles** — add kids with names and fun avatars
- **4 Challenge Packs** — 34 total challenges across:
  - ⭐ Starter Pack (10) — easy mixed wins
  - 🎨 Art Adventures (8) — creative projects
  - 🌟 Life Skills (8) — practical learning
  - 🧠 Brain Games (8) — puzzles & learning
- **Quest Flow** — browse → pick → complete → parent verifies → earn reward
- **Reward Tracking** — total earned per kid, history of completions
- **Responsive Design** — works on phone, tablet, desktop
- **localStorage Persistence** — single device, no account required

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Storage | localStorage (Supabase-ready architecture) |
| Deployment | Vercel-ready |

### What's NOT Built Yet

- User accounts / authentication
- Cloud sync (multi-device)
- Custom challenge creation
- Points economy
- Native mobile apps (iOS/Android)

---

## 3. Target State (v1.0 App Store Release)

### The Complete Picture

Quest Cards v1.0 is a **native mobile app** (iOS + Android) where:

1. **Parents** create a family, add kids, and manage settings
2. **Kids** browse challenge packs, pick quests, and earn points
3. **Points** convert to parent-defined rewards (money, experiences, items)
4. **Custom challenges** let parents add family-specific tasks
5. **Vibes over ages** — challenges tagged by energy, not explicit age ranges
6. **Cloud sync** keeps everything in sync across devices

### Success Metrics

- Family creates account and completes first challenge in < 5 minutes
- Kid can browse and start a quest without parent help
- Parent verification takes < 10 seconds
- At least 3 families use it weekly for 1+ month

---

## 4. Features — Detailed Specifications

### 4.1 Custom Challenges (Phase 2a)

**Problem:** Parents want to add their own challenges. Built-in packs can't cover everything.

**Solution:**
- Built-in packs remain read-only
- Each family gets a **"My Pack"** (custom, editable)
- Any challenge can be **"Copied to My Pack"** and customized
- Parents can create fully original challenges
- Custom challenges have: title, description, icon (from library), reward, and vibe tags

**Data Model Implications:**
```typescript
interface Challenge {
  id: string;
  packId: string;          // "built-in:starter" or "custom:family-123"
  title: string;
  description: string;
  icon: string;
  reward: number;          // Points (not dollars)
  vibeTags: string[];      // ["adventurer", "creative"]
  createdBy?: string;      // userId for custom challenges
  copiedFrom?: string;     // original challengeId if copied
}
```

**UX Notes:**
- "Copy to My Pack" button on every challenge card
- Edit modal pre-fills with original values
- Custom pack appears alongside built-in packs in browse view
- Filter toggle: "Show custom only" / "Show all"

---

### 4.2 Vibe Tags (Phase 2b)

**Problem:** Explicit age ranges ("Ages 4-7") can feel limiting or turn off older kids.

**Solution:** Replace age with **vibe tags** — energy-based labels that feel inclusive.

**Tag System:**

| Tag | Emoji | Roughly... | Vibe |
|-----|-------|------------|------|
| Little Legends | 👶 | Ages 3-5 | Cute, simple, with help |
| Adventurers | ⚔️ | Ages 6-9 | Independent, curious |
| Challengers | 🎯 | Ages 10-13 | Skilled, ambitious |
| Side Quest Energy | 🌙 | Teens+ | Chill, self-directed |
| Squad Goals | 👥 | Any | Social, with friends/family |
| Sweat Unlocked | 💪 | Any | Physical, active |
| Creative Mode | 🎨 | Any | Artistic, expressive |
| Big Brain | 🧠 | Any | Puzzles, learning |
| All Players | 🌍 | Everyone | Universal |

**Implementation:**
- Challenges can have **multiple tags** (e.g., ["adventurer", "creative"])
- Tags shown as badges on challenge cards
- Filter/search by tags in browse view
- Suggested tags based on challenge content (for custom creation)
- **No explicit age numbers shown** — vibes only

**Migration:**
- Update existing 34 challenges with appropriate vibe tags
- Remove any age references from pack metadata

---

### 4.3 Points Economy (Phase 2c)

**Problem:** Direct dollar rewards are inflexible. No "save up" mechanic. Can't easily do non-money rewards.

**Solution:** Hybrid points system that's simple now, expandable later.

**How It Works:**
1. Challenges award **points** (not dollars)
2. Family setting: **exchange rate** (default: 10 points = $1)
3. Points accumulate per kid
4. Parents can add **custom rewards** to a Reward Shop (optional)
5. Kids can browse rewards and "redeem" when they have enough

**Default Rewards (Pre-populated):**
| Reward | Cost | Type |
|--------|------|------|
| $1 cash | 10 pts | Money |
| $5 cash | 50 pts | Money |
| Pick a movie | 30 pts | Experience |
| Extra screen time (30 min) | 20 pts | Experience |
| Stay up late (30 min) | 40 pts | Experience |
| Special breakfast request | 25 pts | Experience |

**Custom Rewards:**
- Parents can add, edit, or remove rewards
- Each reward has: name, point cost, optional description, optional image
- Kids see all available rewards in a "shop" view

**Data Model:**
```typescript
interface Reward {
  id: string;
  familyId: string;
  name: string;
  pointCost: number;
  description?: string;
  icon?: string;
  isDefault: boolean;      // Pre-populated vs custom
  active: boolean;         // Parent can disable without deleting
}

interface Redemption {
  id: string;
  kidId: string;
  rewardId: string;
  pointsSpent: number;
  redeemedAt: Date;
  fulfilledAt?: Date;      // Parent marks as given
  status: 'pending' | 'fulfilled';
}
```

**Migration:**
- Convert existing dollar rewards to points (multiply by 10)
- Add exchange rate setting (default 10:1)
- Add default rewards to new families
- Existing challenge completions get converted (completed for $3 → earned 30 pts)

---

### 4.4 Supabase Backend (Phase 3)

**What It Enables:**
- User accounts (email/password, OAuth)
- Multi-device sync (same family on phone + tablet)
- Data persistence (not lost if app deleted)
- Foundation for social features

**Tables Required:**
- `families` — family unit with settings
- `users` — parent accounts
- `kids` — kid profiles within family
- `challenges` — built-in + custom challenges
- `quests` — active/completed challenge instances
- `rewards` — family reward shop
- `redemptions` — reward redemption history

**Auth Flow:**
- New user → create account → create family → add kids
- Existing family → sign in → data syncs from cloud
- Offline support: queue changes, sync when online

---

### 4.5 Native Mobile Apps (Phase 4)

**Approach:** Capacitor wrapper around existing Next.js app

**Why Capacitor:**
- Same codebase for web + iOS + Android
- Real App Store presence
- Native features: push notifications, haptics, camera (for photo proof)
- 95% of current code stays the same

**Platform-Specific:**
- iOS: App Store submission, Apple sign-in option
- Android: Play Store submission, Google sign-in option
- Both: Push notifications for quest completions needing review

---

## 5. Roadmap

### Phase 1: MVP ✅ (Complete)
- Basic challenge flow
- 4 built-in packs (34 challenges)
- localStorage persistence
- Responsive web design

### Phase 2: Core Features (Current Focus)
**2a. Custom Challenges**
- [ ] "My Pack" per family
- [ ] Copy-to-My-Pack flow
- [ ] Create new challenge UI
- [ ] Icon picker library

**2b. Vibe Tags**
- [ ] Tag data model + migration
- [ ] Update all 34 challenges with tags
- [ ] Tag filtering in browse view
- [ ] Tag badges on challenge cards

**2c. Points Economy**
- [ ] Points conversion (challenges award pts)
- [ ] Exchange rate family setting
- [ ] Reward shop (defaults + custom)
- [ ] Redemption flow
- [ ] Points balance display

### Phase 3: Cloud & Sync
- [ ] Supabase project setup
- [ ] Database schema + migrations
- [ ] Auth (email + OAuth)
- [ ] Data layer swap (localStorage → Supabase)
- [ ] Offline support + sync

### Phase 4: Native Apps
- [ ] Capacitor integration
- [ ] iOS build + TestFlight
- [ ] Android build + internal testing
- [ ] Push notifications
- [ ] App Store submission
- [ ] Play Store submission

### Phase 5: Social & Growth (Future)
- [ ] Family sharing (grandparents, etc.)
- [ ] Friend challenges ("Dare" mode)
- [ ] Pack marketplace
- [ ] Creator tools

---

## 6. Technical Architecture

### Current Architecture (localStorage)

```
┌─────────────────────────────────────────┐
│              Next.js App                │
│  ┌─────────────────────────────────┐   │
│  │         UI Components           │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │       Data Layer (hooks)        │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │       Storage Adapter           │   │
│  │      (localStorage impl)        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Target Architecture (Supabase)

```
┌─────────────────────────────────────────┐
│              Next.js App                │
│  ┌─────────────────────────────────┐   │
│  │         UI Components           │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │       Data Layer (hooks)        │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │       Storage Adapter           │   │
│  │      (Supabase impl)            │───┼──► Supabase
│  └─────────────────────────────────┘   │    (Postgres + Auth)
└─────────────────────────────────────────┘
```

The data layer interface stays the same — only the adapter changes. This is intentional.

### File Structure

```
quest-cards/
├── app/                      # Next.js application
│   └── src/
│       ├── app/             # Routes/pages
│       ├── components/      # UI components
│       │   ├── ui/          # Generic (buttons, cards)
│       │   └── features/    # Feature-specific
│       ├── lib/
│       │   ├── data/        # Storage adapters
│       │   ├── hooks/       # Data hooks
│       │   ├── types/       # TypeScript interfaces
│       │   └── packs/       # Built-in pack data
│       └── styles/          # Global styles
├── docs/                    # Design documents
├── packs/                   # Challenge pack JSON (source of truth)
├── DECISIONS.md             # Build decisions log
├── IDEAS.md                 # Feature parking lot
├── PRD.md                   # This document
└── README.md                # Quick start
```

---

## 7. Design Principles

### For UI/UX

1. **Kid can use independently** — big touch targets, clear icons, minimal reading
2. **Parent can verify in seconds** — single tap approve, batch operations
3. **Celebration matters** — satisfying animations on completion
4. **Progress is visible** — streaks, totals, history at a glance

### For Code

1. **Interfaces over implementations** — swap storage without touching UI
2. **Type everything** — TypeScript catches bugs before runtime
3. **Components are pure** — business logic in hooks, not components
4. **Mobile-first CSS** — base styles for mobile, enhance for larger

### For Data

1. **IDs are UUIDs** — no collisions when syncing
2. **Timestamps everywhere** — createdAt, updatedAt, completedAt
3. **Soft deletes** — never lose data, mark as deleted
4. **Schema supports future** — fields for social, marketplace, even if unused now

---

## 8. Open Questions

Decisions to make as we build:

- [ ] **One active quest or multiple?** — Currently limited to one
- [ ] **Streaks?** — Add streak tracking for consecutive days?
- [ ] **Photo proof?** — Optional photo when completing?
- [ ] **Challenge repeat?** — Can kids redo completed challenges?
- [ ] **Sound effects?** — Subtle sounds on completion?
- [ ] **Dark mode?** — Support system dark mode?

---

## 9. Appendix

### A. Challenge Pack Schema

```typescript
interface ChallengePack {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;           // Accent color for UI
  vibeTags: string[];      // Default tags for pack
  challenges: Challenge[];
  isBuiltIn: boolean;
  version: number;
}
```

### B. User Journey

```
First Launch:
  Welcome → Add Kids → Browse Packs → Start Quest → (complete IRL) → Mark Done → Parent Approves → See Reward!

Return Visit:
  Home (shows active quests) → Continue or Start New → Complete → Verify → Browse Rewards → Redeem?
```

### C. Competitive Landscape

| App | What They Do | How We Differ |
|-----|--------------|---------------|
| **Greenlight** | Debit card + chores | We're challenge-based, not chore-based |
| **Rooster Money** | Allowance tracking | We add gamification + agency |
| **Habitica** | Habit RPG | We're family-focused, simpler for kids |
| **ChoreMonster** | Chore rewards | We're adventure-framed, not chore-framed |

Our angle: **Agency + Adventure + Family**

---

*This is a living document. Update it as the product evolves.*
