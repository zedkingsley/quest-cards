# Feedback Mode Protocol

When receiving feedback, follow this protocol automatically.

## Trigger
- User says "feedback mode" or "feedback:"
- User provides numbered list of issues/requests
- User asks for UX/UI improvements

## Process

### 1. RECEIVE
- Log all feedback items to FEEDBACK.md with date and round number
- Categorize: Bug | UX | Feature | Polish
- Note dependencies between items

### 2. ANALYZE (for each item)
- **What's the actual problem?** (not just the symptom)
- **Who does this affect?** (parent/child/both)
- **What's the ideal UX?** (describe the flow)

### 3. DESIGN
- Sketch the solution
- Consider: What's the minimum change that solves this?
- Consider: Does this create new problems?

### 4. CRITIQUE
- What could go wrong?
- Edge cases?
- Does this conflict with other features?
- Is this over-engineered?

### 5. IMPROVE
- Simplify if possible
- Look for opportunities to solve multiple items together
- Consider future extensibility (but don't gold-plate)

### 6. PLAN EXECUTION
- Order items by: dependencies → impact → complexity
- Group related changes (touch a file once, not three times)
- Identify dead code to remove

### 7. EXECUTE
- Make changes
- **Clean up dead code** (unused components, orphaned imports, old logic)
- Run build to verify no errors
- Test affected flows mentally

### 8. VERIFY
- Does each feedback item work?
- Did we break anything else?
- Is the code cleaner than before?

### 9. DOCUMENT
- Update FEEDBACK.md with status
- Update DECISIONS.md with rationale
- Commit with clear message referencing feedback items

### 10. REPORT
- Summary of what changed
- Decisions made and why
- Any deferred items and why
- What to test

---

## Best Practices

### Code Hygiene
- [ ] Remove unused imports
- [ ] Delete orphaned components
- [ ] Remove commented-out code
- [ ] Remove unused state variables
- [ ] Remove unused handler functions
- [ ] Check for dead CSS classes

### File Hygiene
- [ ] Delete replaced components (e.g., old AddKid.tsx if AddMember.tsx replaced it)
- [ ] Update index exports if applicable
- [ ] Remove unused type definitions

### Git Hygiene
- [ ] Atomic commits (one logical change per commit)
- [ ] Clear commit messages referencing feedback items
- [ ] Push after each feedback round

### Efficiency Tips
- Group related UI changes (don't edit page.tsx 5 times)
- Check if a change can solve multiple feedback items
- Prefer modifying existing components over creating new ones (unless separation is warranted)
- Read the full feedback list before starting (find patterns)

---

## Quick Reference

```
Feedback → Log → Analyze → Design → Critique → Improve → Plan → Execute → Verify → Document → Report
```

**Mantra:** Understand deeply, change minimally, clean ruthlessly.
