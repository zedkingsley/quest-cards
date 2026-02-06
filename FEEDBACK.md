# Quest Cards Feedback Log

---

## Round 4 — 2026-02-05 ✅

### F13: Quick "Add Quest" FAB ✅
**Issue:** No quick way to browse/add more quests when you already have an active one
**Solution:** Floating amber "+" button in bottom-right (above nav) → goes to Quests tab
**Status:** ✅ Done

### F14: Queued quests clickable ✅
**Issue:** Can't tap queued quests to see details
**Solution:** Queued items are now buttons → opens challenge detail modal with isQueued state
**Status:** ✅ Done

---

## Round 3 — 2026-02-05 ✅

### F11: Parents Can't Start Quests for Themselves ✅
**Issue:** As Zed (parent), can't choose a challenge for himself - only "Assign to..." for kids
**Solution:**
- Removed `isParent` check from `handleStartForSelf`
- Parents now see two buttons: "Start for Myself" AND "Assign to a child..."
- Parent is their own issuer when starting for self
**Status:** ✅ Fixed

### F12: Active Quest Not Clickable ✅
**Issue:** As Alex with active task, clicking "Tap to mark done" did nothing
**Root Cause:** onClick only fired if `pack` existed; custom challenges had no pack
**Solution:**
- Created synthetic pack/challenge for custom challenges on click
- Now properly opens detail modal for all quest types
**Status:** ✅ Fixed

---

## Round 2 — 2026-02-05 ✅

### F6: Logo → Home Navigation ✅
**Issue:** Clicking "Quest Cards" logo should navigate to home
**Solution:** Made logo a button that sets activeTab to 'home'
**Status:** ✅ Done

### F7: Profile Switch → Home ✅
**Issue:** Switching profiles should auto-navigate to home
**Solution:** `handleMemberSwitch()` now sets activeTab to 'home' after switching
**Status:** ✅ Done

### F8: Quest Queue System ✅
**Issue:** Kids should queue multiple quests, current shown expanded on home
**Solution:** 
- Added 'queued' status to QuestStatus type
- New `getQueuedQuests()` function
- When starting quest with active one, auto-queues instead
- Approving quest auto-activates next in queue
- Home shows expanded current quest + queued list
- ChallengeCard/ChallengeDetail show "Queued" state
**Status:** ✅ Done

### F9: "I Did It" → Parent Handoff ✅
**Issue:** After marking done, prompt parent to approve immediately or later
**Solution:**
- New `ApprovalHandoff` component
- Shows after kid marks done: "Hand to parent!" + PIN pad option
- Parent can approve now (enter PIN) or dismiss to approve later
**Status:** ✅ Done

### F10: Points → Shop Shortcut ✅
**Issue:** Tapping points should navigate to Shop
**Solution:** Points display in header and stats card are now clickable, navigate to shop tab
**Status:** ✅ Done

---

## Round 1 — 2026-02-05 ✅

### F1: Member Switcher UX ✅
### F2: Parent Quest Assignment Bug ✅
### F3: Kids Pick Own Challenges ✅
### F4: Pack Customization ⏸️ (Deferred)
### F5: Family Tab → Settings ✅

---

## Decisions Log

| Round | ID | Decision | Rationale |
|-------|-----|----------|-----------|
| 1 | D5 | 4-tab navigation | Family management is infrequent |
| 1 | D6 | Header avatar picker modal | Big tap targets, clear info |
| 1 | D7 | Kids start their own quests | Agency for kids |
| 1 | D8 | Explicit child picker for parents | Clarity worth one tap |
| 1 | D9 | Defer pack customization | MVP sufficient |
| 2 | D10 | Quest queueing auto-activates | Seamless flow, no manual "start next" |
| 2 | D11 | Handoff modal is optional | Parent can approve later, kid continues |
| 2 | D12 | Expanded current quest on home | Most important info deserves prominence |

---

## Code Cleanup (Round 2)
- ✅ Deleted `AddKid.tsx` (replaced by `AddMember.tsx`)
- ✅ Deleted `KidSelector.tsx` (replaced by `MemberSelector.tsx`)
- ✅ Version bumped to 0.3.0
