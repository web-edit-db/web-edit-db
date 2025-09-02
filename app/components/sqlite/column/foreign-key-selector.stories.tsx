import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ForeignKeySelector from './foreign-key-selector'

const mockTables = {
  users: ['id', 'name', 'email', 'created_at', 'updated_at'],
  posts: ['id', 'title', 'content', 'user_id', 'published_at'],
  comments: ['id', 'content', 'post_id', 'user_id', 'created_at'],
  categories: ['id', 'name', 'description'],
  tags: ['id', 'name'],
}

const emptyTableTables = {
  empty_table: [],
}

const meta = {
  title: 'SQLite/ColumnCard/ForeignKeySelector',
  component: ForeignKeySelector,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the selectors are disabled',
    },
    tables: {
      description: 'Available tables with their columns',
    },
    value: {
      description: 'Current foreign key selection',
    },
    onChange: {
      description: 'Callback when selection changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ForeignKeySelector>

export default meta
type Story = StoryObj<typeof meta>

export const NoSelection: Story = {
  args: {
    tables: mockTables,
    value: { table: null, column: null },
    disabled: false,
  },
}

export const TableSelected: Story = {
  name: 'Table Selected (No Column)',
  args: {
    tables: mockTables,
    value: { table: 'users', column: null },
    disabled: false,
  },
}

export const UserIdReference: Story = {
  name: 'User ID Reference',
  args: {
    tables: mockTables,
    value: { table: 'users', column: 'id' },
    disabled: false,
  },
}

export const PostIdReference: Story = {
  name: 'Post ID Reference',
  args: {
    tables: mockTables,
    value: { table: 'posts', column: 'id' },
    disabled: false,
  },
}

export const CategoryReference: Story = {
  args: {
    tables: mockTables,
    value: { table: 'categories', column: 'id' },
    disabled: false,
  },
}

export const EmailReference: Story = {
  name: 'Email Reference (Unique Field)',
  args: {
    tables: mockTables,
    value: { table: 'users', column: 'email' },
    disabled: false,
  },
}

export const NoTablesAvailable: Story = {
  args: {
    tables: {},
    value: { table: null, column: null },
    disabled: false,
  },
}

export const EmptyTable: Story = {
  name: 'Table with No Columns',
  args: {
    tables: emptyTableTables,
    value: { table: 'empty_table', column: null },
    disabled: false,
  },
}

export const DisabledEmpty: Story = {
  name: 'Disabled (Empty)',
  args: {
    tables: mockTables,
    value: { table: null, column: null },
    disabled: true,
  },
}

export const DisabledWithSelection: Story = {
  name: 'Disabled (With Selection)',
  args: {
    tables: mockTables,
    value: { table: 'users', column: 'id' },
    disabled: true,
  },
}
