import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Toaster } from './sonner'
import { toast } from 'sonner'

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => toast('This is a default toast')}
            variant="outline"
          >
            Default Toast
          </Button>
          <Button
            onClick={() => toast.success('This is a success toast')}
            variant="outline"
          >
            Success Toast
          </Button>
          <Button
            onClick={() => toast.error('This is an error toast')}
            variant="outline"
          >
            Error Toast
          </Button>
          <Button
            onClick={() => toast.info('This is an info toast')}
            variant="outline"
          >
            Info Toast
          </Button>
          <Button
            onClick={() => toast.warning('This is a warning toast')}
            variant="outline"
          >
            Warning Toast
          </Button>
          <Button
            onClick={() => toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: 'Loading...',
                success: 'Success!',
                error: 'Error!',
              }
            )}
            variant="outline"
          >
            Promise Toast
          </Button>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomPosition: Story = {
  args: {
    position: 'top-right',
  },
}

export const WithCustomDuration: Story = {
  args: {
    duration: 5000,
  },
}
