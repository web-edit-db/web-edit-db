# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Web Edit DB is a React-based Progressive Web App for SQLite database editing in the browser. Built with React 19, TypeScript, Vite, and Tailwind CSS with shadcn/ui components.

## Development Commands

```bash
# Development
npm run dev                 # Start React Router development server
npm run build              # Build for production
npm run preview            # Preview production build

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript type checking
npm run format             # Format code with Prettier
npm run format:check       # Check formatting

# Testing
npm test                   # Run tests in watch mode
npm run test:run          # Run tests once

# Storybook
npm run storybook         # Start Storybook development server
npm run build-storybook   # Build Storybook for production
```

## Architecture

### Core Technologies

- **React 19** with TypeScript and React Router v7 (file-based routing)
- **SQLite in browser** via WebAssembly (@sqlite.org/sqlite-wasm + sql.js)
- **Tailwind CSS v4** with shadcn/ui components
- **PWA** with offline capabilities

### Key Directories

```
app/
├── components/           # React components
│   ├── ui/              # shadcn/ui components (Button, AlertDialog, etc.)
│   └── sqlite/          # SQLite-specific components
├── lib/                 # Utilities and custom hooks
│   └── sqlite/          # SQLite integration layer with hooks
├── routes/              # React Router route components
└── layout/              # Layout components

stories/                 # Storybook stories
.storybook/             # Storybook configuration
```

### SQLite Integration

- Browser-based SQLite using WebAssembly (no server required)
- Context provider pattern via `SqliteProvider`
- Custom hooks in `app/lib/sqlite/` for database operations
- Support for file upload/download, transactions, and error handling

### Component System

Uses shadcn/ui components with Tailwind CSS. Generate new components with:

```bash
npx shadcn@latest add [component-name]
```

## Testing Strategy

- **Unit/Integration**: Vitest with jsdom environment
- **Component testing**: Testing Library + Storybook
- **E2E**: Playwright (configured but tests may need implementation)
- **Visual testing**: Storybook with Chromatic addon

## Build Configuration

### Vite Configuration

- SQLite WASM files excluded from optimization
- PWA plugin with service worker
- Static file copying for SQLite binaries
- Path aliases: `@/*` → `app/*`

### Important Notes

- SSR is **disabled** (client-side only app)
- SQLite WASM requires special handling in build process
- PWA icons and manifest configured for "Web Edit DB"

## Current Development

Project is on `react-rewrite` branch with recent focus on:

- SQLite database management features
- AlertDialog components
- Storybook integration improvements

When implementing new features, follow the established patterns in the SQLite integration layer and use the existing component system.
