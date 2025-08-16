import type { Meta, StoryObj } from '@storybook/react-vite'
import DatabaseVersionButton from './version-button'
import { SqliteProvider } from '@/lib/sqlite/sqlite-provider'

const meta: Meta<typeof DatabaseVersionButton> = {
  title: 'SQLite/DatabaseVersionButton',
  component: DatabaseVersionButton,
  decorators: [
    (Story) => (
      <SqliteProvider>
        <Story />
      </SqliteProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    labelText: {
      control: 'text',
      description: 'Optional label text to display next to the icon',
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
