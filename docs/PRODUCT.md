# Quest Cards - Product Definition

## Vision

Replace passive allowance with adventure. Kids choose their challenges, earn their rewards, and grow through intentional play.

## Problem Statement

Traditional allowance is passive — kids get money just for existing. Chore charts are compliance-focused — do these tasks or else. Neither teaches agency, risk-taking, or the joy of accomplishing something hard.

**Quest Cards** reframes allowance as adventure. Kids browse a deck of challenges, pick what excites them, complete it, and earn their reward. They're in control. They're choosing growth.

## Target Users

### Primary: Parents with kids ages 4-10
- Want to make allowance more meaningful
- Looking for ways to encourage growth/learning outside school
- Value experiences over passive consumption
- Likely have smartphones, comfortable with apps

### Secondary (Future): 
- Older kids/teens (self-directed challenges)
- Friend groups (social dares/challenges)
- Teachers/coaches (class challenges)

## Core User Stories

### Parent Stories
1. As a parent, I want to set up challenges my kid can choose from, so they have agency in what they do
2. As a parent, I want to verify when my kid completes something, so I stay involved
3. As a parent, I want to track what rewards have been earned, so I know what I owe
4. As a parent, I want pre-made challenge packs, so I don't have to invent everything myself
5. As a parent, I want to customize rewards, so they fit our family's values

### Kid Stories
1. As a kid, I want to browse fun challenges, so I can pick one that sounds exciting
2. As a kid, I want to see what reward I'll get, so I'm motivated
3. As a kid, I want to mark when I'm done, so I can get my reward
4. As a kid, I want to see my completed challenges, so I feel proud

## MVP Features (In Scope)

### Must Have
- [ ] Parent account creation (email magic link)
- [ ] Add kid profiles (name, avatar)
- [ ] Browse built-in challenge packs
- [ ] View individual challenges (title, description, icon, reward)
- [ ] Kid picks a challenge → becomes "active"
- [ ] Kid marks challenge "done" → pending parent approval
- [ ] Parent approves → reward recorded
- [ ] View completed challenges + total rewards earned
- [ ] Responsive design (works on phone, tablet, laptop)

### Should Have
- [ ] Challenge categories/filtering
- [ ] Custom rewards per challenge
- [ ] Simple onboarding flow
- [ ] Nice empty states and loading states

### Won't Have (MVP)
- [ ] Custom challenge creation
- [ ] Payment integration (actual money transfer)
- [ ] Multiple families per account
- [ ] Kid-specific logins
- [ ] Social features / sharing
- [ ] Push notifications
- [ ] Photo proof of completion
- [ ] Points/currency system
- [ ] Pack purchases

## Success Metrics (Post-Launch)

1. **Engagement**: Challenges completed per week per family
2. **Retention**: Families still active after 2 weeks
3. **Content**: Which packs/challenges are most popular
4. **Qualitative**: Does it feel fun? Does it spark conversation?

## Design Principles

1. **Agency over compliance**: Kids choose, not assigned
2. **Adventure over chores**: Language matters - "quests" not "tasks"
3. **Simple for kids, powerful for parents**: Kid UI is minimal, parent UI has controls
4. **Offline-friendly**: The real action happens IRL, app just tracks
5. **Extensible**: Architecture supports social mode, custom packs, etc.

## Competitive Landscape

| App | Focus | Why We're Different |
|-----|-------|---------------------|
| Greenlight / GoHenry | Kids banking + chores | We're about growth, not just money management |
| Habitica | Gamified habits | Too complex for young kids, RPG metaphor |
| ChoreMonster | Chore tracking | Compliance-focused, not choice-focused |
| ClassDojo | Classroom behavior | Teacher-focused, not family-focused |

**Our angle**: The "challenge card" metaphor. Curated, growth-oriented content. Kid agency. Simple.

## Future Roadmap (Post-MVP)

### Phase 2: Custom & Social
- Create custom challenges
- Share packs with other families
- Friend challenges ("dare" mode)

### Phase 3: Monetization
- Premium challenge packs ($)
- Points economy
- In-app rewards marketplace

### Phase 4: Platform
- Public challenge board
- Creator tools (make & sell packs)
- API for integrations

---

*Ship the MVP first. Everything else is noise until families are using it.*
