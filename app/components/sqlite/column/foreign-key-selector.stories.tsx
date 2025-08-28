import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ForeignKeySelector from './foreign-key-selector'

const meta = {
  title: 'SQLite/Column/ForeignKeySelector',
  component: ForeignKeySelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ForeignKeySelector>

export default meta
type Story = StoryObj<typeof meta>

const mockTables = {
  users: ['id', 'name', 'email', 'created_at'],
  posts: ['id', 'title', 'content', 'user_id', 'published_at'],
  comments: ['id', 'content', 'post_id', 'user_id', 'created_at'],
}

export const Default: Story = {
  args: {
    tables: mockTables,
    value: {},
    disabled: false,
  },
}

export const WithSelectedTable: Story = {
  args: {
    tables: mockTables,
    value: { table: 'users' },
    disabled: false,
  },
}

export const WithSelectedTableAndColumn: Story = {
  args: {
    tables: mockTables,
    value: { table: 'users', column: 'id' },
    disabled: false,
  },
}

export const EmptyTables: Story = {
  args: {
    tables: {},
    value: {},
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    tables: mockTables,
    value: { table: 'users', column: 'id' },
    disabled: true,
  },
}
