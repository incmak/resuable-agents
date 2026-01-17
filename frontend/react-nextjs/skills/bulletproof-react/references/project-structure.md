# Project Structure - Bulletproof React

## Main Project Structure

The foundational layout places most code in the `src` folder with these core directories:

```
src/
├── app                 # Application layer (routes, main component, provider, router)
├── assets              # Static files (images, fonts)
├── components          # Shared components across the application
├── config              # Global configurations and environment variables
├── features            # Feature-based modules (primary organization method)
├── hooks               # Shared hooks used throughout
├── lib                 # Preconfigured reusable libraries
├── stores              # Global state management
├── testing             # Test utilities and mocks
├── types               # Shared TypeScript types
└── utils               # Shared utility functions
```

## Feature-Based Architecture

For scalability and maintainability, code organization should center on features rather than flat structures. Each feature folder contains:

```
src/features/awesome-feature/
├── api        # API requests and hooks specific to this feature
├── assets     # Feature-specific static files
├── components # Components scoped to this feature
├── hooks      # Feature-specific hooks
├── stores     # State stores for this feature
├── types      # TypeScript types used within the feature
└── utils      # Utility functions for this feature
```

**Key Note:** Not all subdirectories are required—include only what serves the feature's needs.

## Core Organization Principles

### Import Pattern Recommendations

The documentation suggests "import the files directly" rather than using barrel files. This approach preserves Vite's tree-shaking capabilities and prevents performance degradation.

### Preventing Cross-Feature Dependencies

Features should remain independent. Use ESLint's `import/no-restricted-paths` rule to prohibit imports between features. For example, the discussions feature cannot import from the comments feature.

### Unidirectional Code Flow

Enforce a hierarchical import pattern: **shared → features → app**. This creates predictable code movement:

- Shared code (components, hooks, utilities) can be used anywhere
- Features import only from shared modules
- The app layer imports from both features and shared modules

Features cannot import from the app, and shared modules cannot import from features or the app.

## Benefits of This Approach

This architecture enhances collaboration, readability, and scalability. It applies effectively to Next.js, Remix, and React Native projects, making it a flexible framework for modern development teams.
