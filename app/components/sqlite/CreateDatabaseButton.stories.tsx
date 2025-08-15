import type { Meta, StoryObj } from '@storybook/react-vite'
import CreateDatabaseButton, { type CreateDatabaseButtonProps } from './CreateDatabaseButton'
import { useDatabase } from '@/lib/sqlite/useDatabase'

// Create a wrapper component that can use hooks
const StoryWrapper = (args: CreateDatabaseButtonProps) => {
  const { databaseOpened, databaseName } = useDatabase()

  return (
    <div
      className={`flex flex-col items-center p-4 ${databaseOpened ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-950'}`}
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {databaseOpened ? `Current database: ${databaseName}` : 'No database open'}
      </div>
      <CreateDatabaseButton {...args} />
    </div>
  )
}

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
  },
  argTypes: {
    labelText: {
      control: {
        type: 'text',
      },
      type: { name: 'string' },
      description: 'Label text for the button. Use null for no label.',
    },
  },
  render: (args) => <StoryWrapper {...args} />,
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
