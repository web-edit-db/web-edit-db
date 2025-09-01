import type { Meta, StoryObj } from '@storybook/react-vite'
import TableEdit from './table-edit'
import type { ColumnData } from '@/components/sqlite/column/types'

const mockTables = {
  users: ['id', 'name', 'email'],
  posts: ['id', 'title', 'content', 'user_id'],
}

const mockColumns: Omit<ColumnData, 'deleted'>[] = [
  {
    name: 'id',
    type: 'Integer',
    new: false,
    notNull: true,
    unique: true,
    primaryKey: true,
    min: undefined,
    max: undefined,
    defaultValue: { mode: 'sql', value: 'AUTOINCREMENT' },
    foreignKey: { table: null, column: null },
  },
  {
    name: 'title',
    type: 'Text',
    new: false,
    notNull: true,
    unique: false,
    primaryKey: false,
    min: 1,
    max: 255,
    defaultValue: { mode: 'value', value: 'Untitled' },
    foreignKey: { table: null, column: null },
  },
  {
    name: 'user_id',
    type: 'Integer',
    new: true,
    notNull: false,
    unique: false,
    primaryKey: false,
    min: undefined,
    max: undefined,
    defaultValue: { mode: 'none', value: undefined },
    foreignKey: { table: null, column: null },
  },
]

const meta = {
  title: 'SQLite/Table/TableEdit',
  component: TableEdit,
  parameters: {
    layout: 'padded',
  },
  args: {
    name: 'posts',
    columns: mockColumns,
    tables: mockTables,
  },
} satisfies Meta<typeof TableEdit>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongList: Story = {
  args: {
    name: 'posts',
    columns: mockColumns.concat(mockColumns).concat(mockColumns),
  },
}

export const WithValidation: Story = {
  args: {
    name: 'posts',
    columns: [
      {
        name: '', // Invalid: empty name
        type: 'Text',
        new: true,
        notNull: true,
        unique: false,
        primaryKey: false,
        min: 10, // Invalid: min > max
        max: 5,
        defaultValue: { mode: 'value', value: 'Test' },
        foreignKey: { table: null, column: null },
      },
      ...mockColumns.slice(1),
    ],
  },
}
