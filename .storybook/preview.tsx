import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { SqliteProvider } from '../app/lib/sqlite/sqlite-provider'
import '../app/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme

      // Remove existing theme classes
      document.documentElement.classList.remove('dark')

      // Add the selected theme class
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      }

      return Story()
    },
    (Story) => <SqliteProvider>{Story()}</SqliteProvider>,
  ],
}

export default preview
