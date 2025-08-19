import type { Meta, StoryObj } from '@storybook/react-vite'
import DatabaseVersionButton from './version-button'

const meta: Meta<typeof DatabaseVersionButton> = {
  title: 'SQLite/DatabaseVersionButton',
  component: DatabaseVersionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    labelText: null,
    sqliteVersion: '3.45.1',
    appVersion: '1.0.0',
    appBuildDate: '2024-01-15T10:30:00Z',
  },
  argTypes: {
    labelText: {
      control: 'text',
      description: 'Optional label text to display next to the icon',
    },
    sqliteVersion: {
      control: 'text',
      description: 'SQLite version string',
    },
    appVersion: {
      control: 'text',
      description: 'Application version string',
    },
    appBuildDate: {
      control: 'text',
      description: 'Application build date ISO string',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const IconOnly: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    labelText: 'SQLite Version',
  },
}

export const WithCustomLabel: Story = {
  args: {
    labelText: 'Database Info',
  },
}

export const NoVersionData: Story = {
  args: {
    labelText: 'Version Info',
    sqliteVersion: null,
    appVersion: null,
    appBuildDate: null,
  },
}

export const DisabledState: Story = {
  args: {
    labelText: 'Version Info',
    sqliteVersion: null,
    appVersion: '1.0.0',
    appBuildDate: '2024-01-15T10:30:00Z',
  },
}
