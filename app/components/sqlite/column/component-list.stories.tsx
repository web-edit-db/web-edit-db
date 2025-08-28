import type { Meta, StoryObj } from '@storybook/react-vite'
import ComponentList from './component-list'
import type { ColumnData } from './types'

const mockTables = {
  users: ['id', 'name', 'email'],
  posts: ['id', 'title', 'content', 'user_id'],
}

const mockColumns: ColumnData[] = [
  {
    name: 'id',
    type: 'Integer',
    new: false,
    notNull: true,
    unique: true,
    primaryKey: true,
    defaultValue: { mode: 'sql', value: 'AUTOINCREMENT' },
    foreignKey: {},
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
    foreignKey: {},
  },
  {
    name: 'user_id',
    type: 'Integer',
    new: true,
    notNull: false,
    unique: false,
    primaryKey: false,
    defaultValue: { mode: 'none' },
    foreignKey: { table: 'users', column: 'id' },
  },
]

const meta = {
  title: 'SQLite/Column/ComponentList',
  component: ComponentList,
  parameters: {
    layout: 'padded',
  },
  args: {
    columns: mockColumns,
    tables: mockTables,
  },
} satisfies Meta<typeof ComponentList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongList: Story = {
  args: {
    columns: mockColumns.concat(mockColumns).concat(mockColumns),
  },
}
