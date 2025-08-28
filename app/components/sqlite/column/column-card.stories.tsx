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
      type: 'Integer',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      min: 0,
      max: 0,
      defaultValue: {
        mode: 'value',
        value: '1',
      },
      foreignKey: {
        table: undefined,
        column: undefined,
      },
    },
    tables: {},
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const NoMinMax: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'Integer',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      min: undefined,
      max: undefined,
      defaultValue: {
        mode: 'value',
        value: '1',
      },
      foreignKey: {
        table: undefined,
        column: undefined,
      },
    },
  },
}

export const New: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'Integer',
      new: true,
      notNull: false,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'value',
        value: '1',
      },
      foreignKey: {
        table: undefined,
        column: undefined,
      },
    },
  },
}

export const ForeignKey: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'Integer',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      foreignKey: {
        table: 'users',
        column: 'id',
      },
      defaultValue: {
        mode: 'value',
        value: '1',
      },
    },
    tables: {
      users: ['id', 'name', 'email'],
      posts: ['id', 'title', 'content'],
      comments: ['id', 'content', 'post_id'],
    },
  },
}
