import type { Meta, StoryObj } from '@storybook/react-vite'
import ColumnCard from './column-card'

const meta: Meta<typeof ColumnCard> = {
  title: 'SQLite/Column/ColumnCard',
  component: ColumnCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    columnData: {
      name: 'id',
      type: 'INTEGER',
      new: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const New: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'INTEGER',
      new: true,
    },
  },
}
