# CRUSH.md

## Build/Test/Lint Commands
```bash
npm run dev                 # Start development server
npm run build              # Build for production
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking
npm run format             # Format with Prettier
npm test                   # Run tests in watch mode
npm run test:run           # Run tests once
vitest run [pattern]       # Run single test file/pattern
npm run storybook          # Start Storybook
```

## Code Style Guidelines

### Imports & Formatting
- Use single quotes, no semicolons, trailing commas
- 100 char line width, 2 space tabs
- Import order: React, external libs, internal (@/), relative
- Use `@/*` path alias for app directory imports

### TypeScript & Naming
- Strict TypeScript with proper typing
- PascalCase for components, camelCase for functions/variables
- Use `type` for object shapes, `interface` for extensible contracts
- Prefer `const` assertions and explicit return types for hooks

### Components & Patterns
- Use shadcn/ui components with `cn()` utility for styling
- Custom hooks in `app/lib/` with `use` prefix
- Context providers for shared state (see SqliteProvider pattern)
- Error boundaries and proper error handling with try/catch

### SQLite Integration
- Use custom hooks from `app/lib/sqlite/` for database operations
- Handle async operations with proper loading/error states
- Follow established patterns in existing SQLite components