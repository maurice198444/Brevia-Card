```markdown
# Brevia-Card Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the Brevia-Card repository, a TypeScript project built with the Vite framework. You'll learn about file naming, import/export styles, commit message patterns, and how to write and organize tests. This guide will help you contribute code that aligns with the project's established standards.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.ts`, `cardManager.tsx`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import { Card } from './card';
    import { getUserProfile } from '../utils/userProfile';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```typescript
    // card.ts
    export function createCard() { ... }
    export const CARD_TYPE = 'basic';
    ```

### Commit Message Patterns
- Commit messages are **freeform** (no strict prefix), with an average length of 50 characters.
  - Example:
    ```
    Add new card validation logic
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new feature in the app  
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Write your feature using TypeScript, following the import/export conventions.
3. Add or update relevant test files (`*.test.*`).
4. Commit your changes with a clear, concise message.
5. Open a pull request for review.

### Refactoring Existing Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor-code`

1. Identify the code to refactor.
2. Update file names to camelCase if necessary.
3. Ensure all imports remain relative and exports are named.
4. Update or add tests as needed.
5. Commit with a descriptive message about the refactor.

### Writing Tests
**Trigger:** When adding or updating tests  
**Command:** `/write-test`

1. Create or update a test file matching the `*.test.*` pattern.
2. Write tests for your components or utilities.
3. Run the test suite to ensure all tests pass.
4. Commit your changes with a message indicating test updates.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `cardManager.test.ts`
- The specific testing framework is not detected, but standard TypeScript test patterns apply.
- Place test files alongside the modules they test or in a dedicated `__tests__` directory.

**Example:**
```typescript
// cardManager.test.ts
import { createCard } from './cardManager';

test('should create a card with default values', () => {
  const card = createCard();
  expect(card.type).toBe('basic');
});
```

## Commands
| Command         | Purpose                                    |
|-----------------|--------------------------------------------|
| /add-feature    | Start workflow for adding a new feature    |
| /refactor-code  | Begin refactoring existing code            |
| /write-test     | Add or update tests for a module           |
```
