# Component Organization and Styling

## Components Best Practices

### Colocate Components and Logic
Keep components, functions, styles, and state "as close as possible to where they are being used." This improves readability and reduces redundant re-renders.

### Avoid Nested Rendering Functions
Don't create multiple rendering functions inside components. Instead, extract UI units into separate components for better maintainability.

**Anti-pattern example:**
```javascript
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}
```

**Better approach:** Extract as a standalone component and compose it.

### Maintain Consistency
Apply uniform code styles throughout your project—use consistent naming conventions (like PascalCase for components) and leverage linters and formatters.

### Limit Component Props
If a component accepts too many props, consider splitting it into multiple components or use composition patterns with children/slots.

### Abstract Shared Components
For larger projects, create a component library around shared UI elements. Wrap third-party components to adapt them to your application's needs, making future changes easier.

## Component Library Options

**Fully Featured (Pre-styled):**
- Chakra UI
- Ant Design
- Material UI (MUI)
- Mantine

**Headless (Unstyled):**
- Radix UI
- Headless UI
- react-aria
- Ark UI
- Reakit

**Code-based with Styling:**
- ShadCN UI
- Park UI (provide customizable component code)

## Styling Solutions

Popular approaches include:
- Tailwind CSS
- vanilla-extract
- Panda CSS
- CSS Modules
- styled-components
- Emotion

**Note:** React Server Components require zero-runtime styling solutions.

## Storybook Integration

Use Storybook as a component catalogue for developing and testing components in isolation, enabling discoverability across your application.
