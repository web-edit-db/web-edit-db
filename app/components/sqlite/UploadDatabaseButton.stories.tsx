import type { Meta, StoryObj } from '@storybook/react-vite'
import UploadDatabaseButton, { type UploadDatabaseButtonProps } from './UploadDatabaseButton'
import { useDatabase } from '@/lib/sqlite/useDatabase'

// Create a wrapper component that can use hooks
const StoryWrapper = (args: UploadDatabaseButtonProps) => {
  const { databaseOpened, databaseName } = useDatabase()

  return (
    <div
      className={`flex flex-col items-center p-4 ${databaseOpened ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-950'}`}
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {databaseOpened ? `Selected file: ${databaseName}` : 'No file selected'}
      </div>
      <UploadDatabaseButton {...args} />
    </div>
  )
}

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
  },
  argTypes: {
    labelText: {
      control: {
        type: 'text',
      },
      type: { name: 'string' }, // Storybook argTypes type for string
      description: 'Label text for the button. Use null for no label.',
    },
  },
  render: (args) => <StoryWrapper {...args} />,
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
