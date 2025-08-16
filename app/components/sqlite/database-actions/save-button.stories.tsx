import type { Meta, StoryObj } from '@storybook/react-vite'
import SaveDatabaseButton, { type SaveDatabaseButtonProps } from './save-button'
import { useDatabase } from '@/lib/sqlite/use-database'

// Create a wrapper component that can use hooks
const StoryWrapper = (args: SaveDatabaseButtonProps) => {
  const { databaseOpened, databaseName } = useDatabase()

  return (
    <div
      className={`flex flex-col items-center p-4 ${databaseOpened ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-950'}`}
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {databaseOpened ? `Database ready: ${databaseName}` : 'No database to save'}
      </div>
      <SaveDatabaseButton {...args} />
    </div>
  )
}

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
