import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExampleLinked } from './sortable-linked'

const meta = {
  title: 'Core/SortableLinked',
  component: ExampleLinked,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A sortable columns component that allows drag-and-drop between two columns with visual feedback.',
      },
    },
  },
} satisfies Meta<typeof ExampleLinked>

export default meta
type Story = StoryObj<typeof meta>

// Default story with simple text items
export const Default: Story = {
  args: {},
}
