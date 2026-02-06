# Quest Cards Testing

## Quick Start

```bash
cd app

# Run unit/component tests (watch mode)
npm test

# Run unit/component tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui
```

## Test Structure

```
app/
├── src/
│   ├── lib/
│   │   └── storage.test.ts      # Storage layer unit tests
│   ├── components/
│   │   ├── ApprovalHandoff.test.tsx
│   │   └── ChallengeDetail.test.tsx
│   └── test/
│       └── setup.ts             # Test setup (mocks localStorage)
├── e2e/
│   └── quest-flow.spec.ts       # Playwright E2E tests
├── vitest.config.ts
└── playwright.config.ts
```

## Test Types

### Unit Tests (Vitest)
Test individual functions in isolation.

**Location:** `src/lib/*.test.ts`

**What to test:**
- Storage functions (CRUD operations)
- Data transformations
- Business logic (points, quest flow)

### Component Tests (Vitest + Testing Library)
Test React components in isolation.

**Location:** `src/components/*.test.tsx`

**What to test:**
- Component renders correctly
- User interactions work
- Props affect output
- Conditional rendering

### E2E Tests (Playwright)
Test complete user flows in real browser.

**Location:** `e2e/*.spec.ts`

**What to test:**
- Critical user journeys
- Cross-component flows
- Mobile viewport behavior

## Writing Tests

### Storage Layer Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createFamily, addMember, resetAllData } from './storage';

describe('Feature Name', () => {
  beforeEach(() => {
    resetAllData(); // Always reset before each test
  });

  it('does something', () => {
    createFamily('Test');
    const member = addMember('Kid', '👦', 'child');
    expect(member.role).toBe('child');
  });
});
```

### Component Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click', () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can complete quest', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Quests/i }).click();
  await expect(page.getByText('Quest Packs')).toBeVisible();
});
```

## Test Naming Convention

Use descriptive names that explain what's being tested:

```typescript
// Good
it('shows Skip button instead of "I\'ll approve later" (F15)')
it('parent can start quest for themselves')

// Bad  
it('test button')
it('works')
```

Include feedback item references (F13, F14, etc.) when testing specific features.

## Running Tests in CI

Tests run automatically on push. See `.github/workflows/test.yml` (if configured).

Local pre-commit: `npm run test:run && npm run build`

## Coverage

Run `npm run test:coverage` to generate coverage report.

Target: 80%+ for `src/lib/`, 70%+ for `src/components/`.
