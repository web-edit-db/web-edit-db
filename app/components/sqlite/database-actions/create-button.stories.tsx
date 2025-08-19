import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import CreateDatabaseButton from './create-button'

const meta = {
  title: 'SQLite/CreateDatabaseButton',
  component: CreateDatabaseButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button component for creating new SQLite databases. Shows a plus icon and handles database creation with name input dialog. If a database is already open, it warns the user before proceeding.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    labelText: null,
    createDatabase: fn(),
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
    createDatabase: {
      description: 'Function to create a new database.',
    },
  },
} satisfies Meta<typeof CreateDatabaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    labelText: 'Create Database',
  },
}

export const DatabaseAlreadyOpen: Story = {
  args: {
    labelText: 'Create Database',
    databaseOpened: true,
  },
}

export const Loading: Story = {
  args: {
    labelText: 'Create Database',
    isLoading: true,
  },
}

export const LoadingWithDatabaseOpen: Story = {
  args: {
    labelText: 'Create Database',
    databaseOpened: true,
    isLoading: true,
  },
}
