import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import SaveDatabaseButton from './save-button'

const meta = {
  title: 'SQLite/SaveDatabaseButton',
  component: SaveDatabaseButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button component for saving/downloading SQLite database files. Shows a download icon and handles database export using browser-fs-access. Only enabled when a database is open.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    labelText: null,
    saveDatabase: fn(),
    databaseOpened: false,
    isLoading: false,
  },
  argTypes: {
    labelText: {
      control: {
        type: 'text',
      },
      type: { name: 'string' },
      description: 'Label text for the button. Use null for no label.',
    },
    databaseOpened: {
      control: {
        type: 'boolean',
      },
      description: 'Whether a database is currently open.',
    },
    isLoading: {
      control: {
        type: 'boolean',
      },
      description: 'Whether database operations are in progress.',
    },
    saveDatabase: {
      description: 'Function to save the database to file system.',
    },
  },
} satisfies Meta<typeof SaveDatabaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    labelText: 'Save Database',
  },
}

export const DatabaseOpen: Story = {
  args: {
    labelText: 'Save Database',
    databaseOpened: true,
  },
}

export const Loading: Story = {
  args: {
    labelText: 'Save Database',
    databaseOpened: true,
    isLoading: true,
  },
}

export const DisabledNoDB: Story = {
  args: {
    labelText: 'Save Database',
    databaseOpened: false,
    isLoading: false,
  },
}
