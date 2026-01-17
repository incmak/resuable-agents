# API Layer Structure & Patterns

## Core Principles

The bulletproof-react documentation outlines two fundamental API layer patterns:

### 1. Single API Client Instance

Rather than creating multiple client instances, the pattern recommends "a single instance of the API client that has been pre-configured and can be reused throughout the application." This applies to REST, GraphQL, or other API types.

**Supported libraries include:**
- Native fetch API
- axios
- graphql-request
- apollo-client

### 2. Structured Request Declarations

API requests should be defined and exported separately rather than declared inline. This maintains organizational clarity and type safety.

**Each declaration comprises three components:**

1. **Types & validation schemas** — Define request and response data structures
2. **Fetcher function** — Calls endpoints using the centralized API client instance
3. **Custom hook** — Wraps fetcher logic with data-fetching libraries for state management and caching

**Supported data-fetching libraries:**
- react-query (TanStack Query)
- SWR
- apollo-client
- urql

## Example Pattern

```typescript
// 1. Types
type GetUsersResponse = {
  users: User[];
};

// 2. Fetcher function
const getUsers = async (): Promise<GetUsersResponse> => {
  return apiClient.get('/users');
};

// 3. Custom hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
```

## Benefits

This approach provides several advantages:
- Clear inventory of available endpoints
- Enhanced type safety through response typing and inference
- Organized, colocated API logic
- Simplified maintenance and refactoring

The repository includes concrete implementation examples for both query and mutation patterns in its example application.
