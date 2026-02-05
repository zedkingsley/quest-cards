# Quest Cards - Data Model

## Overview

The data model supports:
1. Family accounts with multiple kid profiles
2. Challenge packs with categorized challenges
3. Active/completed challenge tracking
4. Flexible reward system

Designed for extensibility toward social features and custom content.

---

## Entity Relationship Diagram (Conceptual)

```
┌─────────────┐       ┌─────────────┐
│   Family    │──────<│    Kid      │
│  (account)  │       │  (profile)  │
└─────────────┘       └──────┬──────┘
                             │
                             │ has many
                             ▼
┌─────────────┐       ┌─────────────┐
│    Pack     │──────<│  Challenge  │
│ (template)  │       │ (template)  │
└─────────────┘       └──────┬──────┘
                             │
                             │ instance of
                             ▼
                      ┌─────────────┐
                      │ KidChallenge│
                      │  (active/   │
                      │  completed) │
                      └─────────────┘
```

---

## Tables

### families
The parent/account holder. One family = one login.

```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,  -- "The Smith Family"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### kids
Kid profiles within a family. No separate login.

```sql
CREATE TABLE kids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,  -- emoji or image URL
  birth_year INT,  -- optional, for age-appropriate filtering
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### packs
Challenge pack templates. Built-in packs are seeded, custom packs are family-owned.

```sql
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,  -- 'starter-pack', 'art-adventures'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,  -- emoji
  category TEXT,  -- 'mixed', 'creative', 'life-skills', 'learning'
  is_builtin BOOLEAN DEFAULT false,
  family_id UUID REFERENCES families(id),  -- NULL for built-in packs
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### challenges
Individual challenge templates within a pack.

```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,  -- detailed how-to (optional)
  icon TEXT,  -- emoji
  difficulty TEXT DEFAULT 'medium',  -- 'easy', 'medium', 'hard'
  suggested_reward_type TEXT DEFAULT 'money',  -- 'money', 'experience', 'points'
  suggested_reward_value TEXT,  -- '$3', 'Ice cream date', '50 points'
  time_estimate TEXT,  -- '15 minutes', '1 hour', '1 week'
  age_min INT,
  age_max INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pack_id, slug)
);
```

### kid_challenges
Instance of a challenge being attempted by a kid.

```sql
CREATE TABLE kid_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kid_id UUID REFERENCES kids(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',  -- 'active', 'pending_review', 'completed', 'abandoned'
  custom_reward TEXT,  -- override suggested reward
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  parent_notes TEXT,  -- parent can add notes on completion
  UNIQUE(kid_id, challenge_id, started_at)  -- can redo challenges
);
```

---

## Status Flow

```
[Browse Challenges]
        │
        ▼ Kid picks
    ┌────────┐
    │ active │ ← Challenge is in progress
    └────┬───┘
         │ Kid marks done
         ▼
┌────────────────┐
│ pending_review │ ← Waiting for parent
└────────┬───────┘
         │ Parent approves
         ▼
    ┌───────────┐
    │ completed │ ← Reward earned!
    └───────────┘
    
(Parent can also send back to 'active' with feedback)
```

---

## Row-Level Security (Supabase)

Families can only see their own data:

```sql
-- Families: users see only their own
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own family" ON families
  FOR SELECT USING (auth.uid()::text = id::text);

-- Kids: users see only kids in their family
ALTER TABLE kids ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Users can view own kids" ON kids
  FOR ALL USING (
    family_id IN (SELECT id FROM families WHERE id = auth.uid())
  );

-- Similar for kid_challenges...

-- Packs/Challenges: everyone can see built-in, family sees own custom
CREATE POLICY "View built-in packs" ON packs
  FOR SELECT USING (is_builtin = true OR family_id = auth.uid());
```

---

## Indexes

```sql
CREATE INDEX idx_kids_family ON kids(family_id);
CREATE INDEX idx_challenges_pack ON challenges(pack_id);
CREATE INDEX idx_kid_challenges_kid ON kid_challenges(kid_id);
CREATE INDEX idx_kid_challenges_status ON kid_challenges(status);
```

---

## Future Extensions

### For Social Mode
```sql
-- Groups (families, friend groups, etc.)
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  type TEXT,  -- 'family', 'friends', 'public'
  name TEXT,
  -- ...
);

-- Group membership
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id),
  user_id UUID,
  role TEXT,  -- 'admin', 'member', 'kid'
  -- ...
);
```

### For Points Economy
```sql
-- Wallets
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  owner_id UUID,
  owner_type TEXT,  -- 'kid', 'family'
  points_balance INT DEFAULT 0,
  -- ...
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  amount INT,
  type TEXT,  -- 'earned', 'spent', 'transferred'
  source_type TEXT,  -- 'challenge', 'purchase', 'gift'
  source_id UUID,
  -- ...
);
```

---

*This model is intentionally simple for MVP. The extension patterns show how it scales.*
