import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import UploadDatabaseButton from './upload-button'

const meta = {
  title: 'SQLite/UploadDatabaseButton',
  component: UploadDatabaseButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button component for uploading/opening SQLite database files. Shows an upload icon and handles database state management. This demo shows the behavior of the UploadDatabaseButton component.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    labelText: null,
    openDatabase: fn(),
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
    openDatabase: {
      description: 'Function to open a database from file system.',
    },
  },
} satisfies Meta<typeof UploadDatabaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    labelText: 'Upload Database',
  },
}

export const DatabaseAlreadyOpen: Story = {
  args: {
    labelText: 'Upload Database',
    databaseOpened: true,
  },
}

export const Loading: Story = {
  args: {
    labelText: 'Upload Database',
    isLoading: true,
  },
}

export const LoadingWithDatabaseOpen: Story = {
  args: {
    labelText: 'Upload Database',
    databaseOpened: true,
    isLoading: true,
  },
}
