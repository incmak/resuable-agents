---
name: bulletproof-react
description: Guide developers in structuring React and Next.js applications using the Bulletproof React architecture pattern - a feature-based, scalable project structure for production-ready applications. Use this skill when users ask to "follow bulletproof", "follow architecture", "follow structure", "maintain structure", "use bulletproof react", or when they need to organize/refactor React/Next.js projects following best practices for scalability and maintainability. Also triggers when creating new features, components, or restructuring existing codebases to follow production-ready patterns.
---

# Bulletproof React Architecture

## Overview

This skill helps structure React and Next.js applications following Bulletproof React principles: a feature-based architecture designed for scalability, maintainability, and production readiness. The architecture emphasizes clear separation of concerns, independent features, and unidirectional code flow.

## Core Principles

1. **Feature-based organization** - Code organized by features, not file types
2. **Colocation** - Keep related code close together
3. **Unidirectional flow** - Shared → Features → App (strict import hierarchy)
4. **Independent features** - Features don't import from each other
5. **Scalability first** - Structure supports growing codebases and teams

## Project Variants

Bulletproof React supports three application types:

- **react-vite**: Lightweight React with Vite build tool
- **nextjs-app**: Next.js with App Router (modern, RSC-ready)
- **nextjs-pages**: Next.js with Pages Router (traditional)

The core architecture principles apply to all variants, with minor structural differences.

## Main Directory Structure

```
src/
├── app/                # Application layer (routes, providers, router)
├── assets/             # Static files (images, fonts)
├── components/         # Shared components used across features
├── config/             # Global configurations, environment variables
├── features/           # Feature-based modules (PRIMARY organization)
├── hooks/              # Shared hooks
├── lib/                # Preconfigured reusable libraries
├── stores/             # Global state management
├── testing/            # Test utilities and mocks
├── types/              # Shared TypeScript types
└── utils/              # Shared utility functions
```

## Feature Structure

Each feature is self-contained with its own components, API layer, hooks, and state:

```
src/features/user-management/
├── api/               # Feature-specific API requests and hooks
├── assets/            # Feature-specific static files
├── components/        # Components used only in this feature
├── hooks/             # Feature-specific hooks
├── stores/            # Feature-specific state stores
├── types/             # Feature-specific TypeScript types
└── utils/             # Feature-specific utilities
```

**Important:** Not all subdirectories are required—only include what the feature needs.

## Implementation Workflow

### 1. Determine the Scope

**For new features:**

- Create new feature directory in `src/features/`
- Name features by domain (e.g., `authentication`, `user-profile`, `invoicing`)

**For shared functionality:**

- Components → `src/components/`
- Hooks → `src/hooks/`
- Utils → `src/utils/`

**For existing code:**

- Identify which feature owns the functionality
- Move code to appropriate feature directory
- Update imports following unidirectional flow

### 2. Structure the Code

**API Layer** (in `feature/api/`):

- Create separate files for related endpoints
- Each file should export types, fetcher functions, and custom hooks
- Use centralized API client instance (axios, fetch, etc.)
- See [references/api-layer.md](references/api-layer.md) for patterns

**Components** (in `feature/components/`):

- Keep components colocated with their usage
- Extract shared components only when truly reused across features
- Avoid nested render functions—create separate components
- See [references/components-and-styling.md](references/components-and-styling.md)

**State Management** (in `feature/stores/`):

- Choose appropriate state type (component, application, server, form, URL)
- Keep state as local as possible
- Use dedicated caching for server state (React Query, SWR)
- See [references/state-management.md](references/state-management.md)

### 3. Enforce Import Rules

**Unidirectional code flow:**

```
Shared code (components, hooks, utils)
    ↓ (can be imported by)
Features (independent, isolated)
    ↓ (can be imported by)
App layer (routes, providers)
```

**Prohibited imports:**

- ❌ Features importing from other features
- ❌ Shared code importing from features
- ❌ Shared code importing from app layer
- ❌ Features importing from app layer

**Enforce with ESLint:**

```javascript
// .eslintrc.js
rules: {
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        // Prevent feature cross-imports
        {
          target: './src/features/feature-a',
          from: './src/features/feature-b',
        },
      ],
    },
  ],
}
```

### 4. Handle Dependencies

**When features need shared logic:**

1. Extract to `src/components/`, `src/hooks/`, or `src/utils/`
2. Both features import from shared directory
3. Shared code remains feature-agnostic

**When features need to communicate:**

1. Use global state management (`src/stores/`)
2. Use URL state for shareable data
3. Lift state to app layer if needed
4. Consider if they should be one feature instead

## Key Patterns

### Avoid Barrel Files

**Don't:**

```typescript
// src/components/index.ts
export * from './Button';
export * from './Card';
```

**Do:**

```typescript
// Direct imports
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
```

**Reason:** Preserves tree-shaking and build performance.

### Component Colocation

**Don't:**

```
src/
├── components/
│   ├── UserProfile.tsx
│   ├── UserAvatar.tsx
│   └── UserBio.tsx
```

**Do:**

```
src/features/user-profile/
├── components/
│   ├── UserProfile.tsx
│   ├── UserAvatar.tsx (only used in UserProfile)
│   └── UserBio.tsx (only used in UserProfile)
```

### API Organization

**Don't:**

```typescript
// Inline API calls in components
const users = await axios.get('/api/users');
```

**Do:**

```typescript
// feature/api/users.ts
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
  });
};

// feature/components/UserList.tsx
const { data } = useUsers();
```

## Reference Documentation

For detailed implementation guidance, see:

- **[project-structure.md](references/project-structure.md)** - Complete directory structure and organization principles
- **[api-layer.md](references/api-layer.md)** - API client setup, request patterns, and data fetching hooks
- **[components-and-styling.md](references/components-and-styling.md)** - Component best practices, styling solutions, and library recommendations
- **[state-management.md](references/state-management.md)** - State categorization, when to use different solutions, and patterns

## Common Scenarios

### Creating a New Feature

```bash
# Create feature structure
mkdir -p src/features/invoicing/{api,components,hooks,types}

# Add API layer
touch src/features/invoicing/api/invoices.ts

# Add components
touch src/features/invoicing/components/InvoiceList.tsx
```

### Refactoring Existing Code

1. Identify the feature domain
2. Create feature directory if doesn't exist
3. Move related components, hooks, API calls into feature
4. Update imports to follow unidirectional flow
5. Extract truly shared code to `src/components|hooks|utils`

### Sharing Code Between Features

1. Move shared code to appropriate shared directory:
   - Components → `src/components/`
   - Hooks → `src/hooks/`
   - Utils → `src/utils/`
   - Types → `src/types/`
2. Update imports in both features
3. Ensure shared code is feature-agnostic

## Additional Resources

- **Official Repository**: https://github.com/alan2207/bulletproof-react
- **Documentation**: https://github.com/alan2207/bulletproof-react/blob/master/docs
- **Example Apps**: https://github.com/alan2207/bulletproof-react/tree/master/apps

## When NOT to Use This Skill

- Simple landing pages or static sites
- Prototypes or proof-of-concepts
- Projects with fewer than 5 components
- When explicitly instructed to use different architecture

This architecture shines for medium-to-large applications with multiple features, teams, and long-term maintenance requirements.
