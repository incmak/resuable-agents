# State Management Guidelines

## Core Principle
Rather than centralizing all state, divide it into categories based on usage patterns to "streamline your state management process and enhance your application's overall efficiency."

## State Categories & Solutions

### 1. Component State
**When to use:** State specific to individual components that doesn't need global sharing

**Tools:**
- `useState` – "for simpler states that are independent"
- `useReducer` – "for more complex states where on a single action you want to update several pieces of state"

**Best practice:** Start locally; elevate to parent components only when other parts need access.

---

### 2. Application State
**When to use:** Global application concerns like modals, notifications, and theme toggling

**Recommended solutions:**
- Context + Hooks
- Redux + Redux Toolkit
- MobX
- Zustand
- Jotai
- XState

**Key guidance:** "Localize the state as closely as possible to the components that require it. Avoid unnecessarily globalizing all state variables."

---

### 3. Server Cache State
**When to use:** Data retrieved from backend for client-side reuse

**Tools:**
- React Query (REST/GraphQL)
- SWR (REST/GraphQL)
- Apollo Client (GraphQL)
- URQL (GraphQL)
- RTK Query

**Insight:** Dedicated caching libraries outperform storing remote data in Redux or similar state stores.

---

### 4. Form State
**When to use:** Managing complex form inputs with validation and submission

**Libraries:**
- React Hook Form
- Formik
- React Final Form

**Validation tools:**
- Zod
- Yup

**Note:** Forms can be controlled or uncontrolled; abstractions wrapping library functionality help adapt to app-specific needs.

---

### 5. URL State
**When to use:** Data stored in browser address bar for bookmarking and sharability

**Implementation:** Use route parameters (e.g., `/app/${dynamicParam}`) or query strings (e.g., `/app?param=1`) via React Router.
