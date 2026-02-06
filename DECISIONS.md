# DECISIONS.md - Quest Cards Build Log

This document tracks every significant decision made during builds.

---

## Codebot Decision-Making Framework

**Rule: Codebot is autonomous during build sessions.**

When building, I don't ask Zed questions. Instead:

1. **Identify the decision** — What's unclear or has multiple valid options?

2. **Analyze from multiple perspectives:**
   - 👤 **User personas** — What does a parent want? A kid? A couple using P2P?
   - 💰 **Business** — Does this support growth, retention, monetization?
   - 🔧 **Technical** — Is it scalable? Maintainable? Future-proof?
   - 🎨 **Design** — Is it intuitive? Delightful? Consistent?
   - ⚡ **Pragmatic** — Can we ship it today, or is it scope creep?

3. **Make the call** — Pick the best option and commit.

4. **Document it** — Add to this file under the relevant build session.

5. **Keep building** — Don't stop until the task is COMPLETE and workable.

6. **Surface when done** — Only come back to Zed with a finished, testable result.

**Escalation (rare):** Only pause for Zed if the decision would be:
- Irreversible AND expensive to undo (e.g., mass data migration)
- Outside the stated scope (e.g., "should we pivot to a different product?")
- Requires spending money (e.g., paid API, hosting tier)

---

## Session: 2026-02-05 (Overnight Build)

### Meta Decisions

**Q: What's my build order?**
**A:** Refined order for solo overnight build:
1. ✅ Project setup & decision log (this file)
2. Product definition (what exactly are we building)
3. Data model design (foundations matter)
4. Tech stack setup (get environment running)
5. Challenge pack content (need real content to test with)
6. Core app build (the actual coding)
7. Testing & polish
8. Deploy & document
9. Push to GitHub

**Reasoning:** Content before code. I need to understand what challenges look like before I can build the UI to display them. Also, having real content makes testing feel real.

---

### Platform Decisions

**Q: Web or mobile for MVP?**
**A:** Web app (responsive, PWA-ready)

**Reasoning:**
- Zed testing on Mac → web works instantly
- No App Store/TestFlight delays
- Can still feel app-like with good responsive design
- React skills transfer to React Native later if needed
- Faster iteration cycle for prototype phase

---

**Q: What framework?**
**A:** Next.js 14 (App Router) + TypeScript + Tailwind CSS

**Reasoning:**
- Next.js: Fast to build, great DX, easy deployment to Vercel
- TypeScript: Catches errors, better for data model work
- Tailwind: Rapid UI development, responsive built-in
- All free, all well-documented

---

**Q: Backend/Database?**
**A:** localStorage for MVP, Supabase-ready architecture

**Reasoning:**
- Original plan was Supabase, but that requires account creation and API setup
- For overnight MVP: localStorage gets Zed a testable app immediately
- Data model is still the same — just stored locally instead of remotely
- Easy migration path: swap localStorage adapter for Supabase adapter later
- Tradeoff: single-device only, no sync. But for testing with daughter on one device, this is fine.
- **Migration to Supabase**: When ready, we add Supabase, create the tables, and swap the data layer

---

**Q: Hosting/Deployment?**
**A:** Vercel (free tier)

**Reasoning:**
- Native Next.js support
- Free for personal projects
- Instant deployments from GitHub
- Preview URLs for each commit

---

### Design Decisions

**Q: App name?**
**A:** "Quest Cards" (working title)

**Reasoning:**
- "Challenge" feels homework-y, "Quest" feels adventurous
- "Cards" connects to the physical card metaphor Zed described
- Short, memorable, available (I'll verify domain/app store later)
- Can always rename before public launch

---

**Q: Visual design direction?**
**A:** Playful but not childish. Think: Duolingo meets a friendly card game.

**Reasoning:**
- Needs to appeal to 5-year-old (fun, colorful, icons)
- But also needs to not embarrass older kids or adults (social mode later)
- Cards as primary metaphor - each challenge is a "card"
- Bright colors, rounded corners, satisfying interactions

---

**Q: Reading level accommodation?**
**A:** Every challenge has: Icon + Title + Short Description. Parent can read aloud, or early reader can try. Future: add audio descriptions.

**Reasoning:**
- Zed said "pictures and words in combination"
- Icons provide visual anchor even for non-readers
- Keep text short and simple
- Parent will be involved anyway for verification

---

### Data Model Decisions

**Q: How do families/groups work?**
**A:** Simple for MVP: One "family" per account. Parent is admin, can add kid profiles. Kids don't need their own login - parent manages.

**Reasoning:**
- 5-year-old shouldn't need to manage a login
- Parent is always involved (verification)
- Simpler onboarding: one account, add kids as profiles
- Can add kid logins later for older kids

---

**Q: How do packs work?**
**A:** Packs are collections of challenges. Some built-in (come with app), eventually custom/purchasable. MVP: 3-4 built-in packs.

**Reasoning:**
- Need enough content to feel real (~30-40 challenges)
- Pack structure allows for expansion
- Categories help parents find relevant challenges
- Built-in packs = no payment integration needed for MVP

---

**Q: How do rewards work?**
**A:** Each challenge has a "suggested reward" (e.g., "$3" or "Pick a movie"). Parent can customize. On completion, reward is displayed - actual fulfillment is offline.

**Reasoning:**
- Real money handling = complex (Stripe, etc.)
- For family use, trust-based is fine
- App tracks what's earned, parent pays out IRL
- Flexibility: some challenges worth money, some worth experiences

---

**Q: Verification flow?**
**A:** MVP: Parent confirms completion. Simple approve/request-changes flow. Future: photo proof, family voting, etc.

**Reasoning:**
- Kid marks "I did it!" → Parent gets notification → Parent approves
- Keeps parent in the loop
- Simple for MVP, extendable later

---

### Content Decisions

**Q: Which packs to build for MVP?**
**A:** 
1. **Starter Pack** - 10 easy, mixed challenges (quick wins)
2. **Art Adventures** - 8 creative/art challenges
3. **Life Skills** - 8 practical challenges (letters, cooking, etc.)
4. **Brain Games** - 8 puzzle/riddle/learning challenges

**Reasoning:**
- ~34 challenges total = feels substantial
- Mix of fun and practical
- Covers several of Zed's ideas
- Can add Adventure/Mindset/etc. packs post-launch

---

## Questions for Zed (Morning Review)

1. **App name**: I went with "Quest Cards" - like it, or want something else?
2. **Reward defaults**: I'm suggesting $1-5 per challenge. Too high? Too low?
3. **Age range labeling**: Should packs show age ranges (e.g., "Ages 4-7")? 
4. **Difficulty levels**: Easy/Medium/Hard, or just let rewards signal difficulty?
5. **Progress/streaks**: Add streak tracking ("3 days in a row!")? Or keep simple?
6. **One active quest limit**: Currently a kid can only have ONE active quest at a time. Want multiple?
7. **Custom rewards**: Should parent be able to override reward when starting a challenge?
8. **Challenge repeat**: Can kids redo completed challenges? (Currently no)

---

## Build Log

### 00:35 - 01:15 PST
- Created project structure
- Wrote DECISIONS.md, PRODUCT.md, DATA-MODEL.md
- Created 4 challenge packs (34 challenges total)
- Set up Next.js with TypeScript + Tailwind
- Built data layer (localStorage-based, Supabase-ready)
- Created all UI components
- Implemented full challenge flow
- Dev server running on localhost:3000

### What's Working
- ✅ Add/remove kid profiles
- ✅ Browse all packs and challenges
- ✅ Start a quest
- ✅ Mark quest complete (pending review)
- ✅ Parent approve/reject
- ✅ Track completed challenges and rewards
- ✅ Stats dashboard
- ✅ Settings with reset option
- ✅ Responsive design
- ✅ PWA manifest

### What's Not Built (Intentionally Deferred)
- ❌ Supabase backend (using localStorage for instant testing)
- ❌ Auth/login (single-device prototype)
- ❌ Custom challenge creation
- ❌ Photo proof
- ❌ Push notifications

---

*MVP complete. Ready for morning testing.*
