import type { Meta, StoryObj } from '@storybook/react-vite'
import { SortableLinked } from './sortable-linked'

const meta = {
  title: 'Core/SortableLinked',
  component: SortableLinked,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A sortable columns component that allows drag-and-drop between two columns with visual feedback.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SortableLinked>

export default meta
type Story = StoryObj<typeof meta>

// Default story with simple text items
export const Default: Story = {
  args: {},
}
