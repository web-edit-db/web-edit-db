// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import checkFile from 'eslint-plugin-check-file'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  [
    globalIgnores(['build', './.react-router/types', '.storybook', 'storybook-static']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'check-file': checkFile,
        'no-relative-import-paths': noRelativeImportPaths,
      },
      rules: {
        // Enforce kebab-case for all file names
        'check-file/filename-naming-convention': [
          'error',
          {
            '**/*.{ts,tsx,js,jsx}': 'KEBAB_CASE',
          },
          {
            // Allow exceptions for config files
            ignoreMiddleExtensions: true,
          },
        ],
        // Enforce kebab-case for all folder names
        'check-file/folder-naming-convention': [
          'error',
          {
            'app/**/': 'KEBAB_CASE',
            'src/**/': 'KEBAB_CASE',
          },
        ],
        // Enforce absolute imports with @/ alias over relative imports
        'no-relative-import-paths/no-relative-import-paths': [
          'error',
          {
            allowSameFolder: true, // Allow ./file imports within same directory
            rootDir: 'app', // Our app directory
            prefix: '@', // Use @/ alias
          },
        ],
        // Enforce naming conventions for React components and hooks
        '@typescript-eslint/naming-convention': [
          'error',
          // React components must be PascalCase
          {
            selector: 'function',
            filter: {
              regex: '^[A-Z]',
              match: true,
            },
            format: ['PascalCase'],
          },
          // Hook functions must start with 'use' and be camelCase
          {
            selector: 'function',
            filter: {
              regex: '^use[A-Z]',
              match: true,
            },
            format: ['camelCase'],
          },
          // Variables should generally be camelCase
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            filter: {
              regex: '^(__.*__|_.*)',
              match: false,
            },
          },
        ],
      },
    },
    eslintConfigPrettier,
  ],
  storybook.configs['flat/recommended'],
)
