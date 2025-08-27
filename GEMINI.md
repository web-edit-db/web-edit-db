# GEMINI Code Assistant

This document provides instructions for the Gemini code assistant to effectively interact with the `web-edit-db` project.

## Project Overview

`web-edit-db` is a web-based database editor built with React, TypeScript, and Vite. It allows users to interact with an in-browser SQLite database. The application utilizes a modern tech stack, including Tailwind CSS for styling, Radix UI for accessible components, and React Router for navigation.

### Key Technologies

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Tabler Icons, Sonner
- **Database:** SQLite (in-browser via `sqlite-wasm` and `sql.js`)
- **Testing:** Vitest, Storybook
- **Linting/Formatting:** ESLint, Prettier

## Building and Running

The following commands are available in `package.json` to build, run, and test the project:

- **`npm run dev`**: Starts the development server with hot module replacement.
- **`npm run build`**: Builds the application for production. The output is generated in the `build/client` directory.
- **`npm run lint`**: Lints the codebase using ESLint.
- **`npm run preview`**: Previews the production build.
- **`npm test`**: Runs the test suite using Vitest.
- **`npm run storybook`**: Starts the Storybook server for component development and documentation.
- **`npm run build-storybook`**: Builds the Storybook for deployment.

## Development Conventions

- **Styling:** The project uses Tailwind CSS for styling. Utility classes should be used whenever possible.
- **Components:** Reusable UI components are located in `app/components/ui`. Components from Radix UI are used for building accessible components.
- **State Management:** The project uses React hooks for state management. For more complex state, consider using a state management library.
- **Routing:** Routing is handled by React Router. The routes are defined in `app/routes.ts`.
- **Database:** The application uses an in-browser SQLite database. The database logic is located in `app/lib/sqlite`.
- **Testing:** Unit tests are written with Vitest and are located next to the files they test. Storybook is used for component testing and documentation.
- **Linting and Formatting:** The project uses ESLint and Prettier to enforce code style and quality. Make sure to run `npm run lint` and `npm run format` before committing changes.
