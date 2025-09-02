import type { Meta, StoryObj } from '@storybook/react-vite'
import ColumnCard from './column-card'

const mockTables = {
  users: ['id', 'name', 'email', 'created_at', 'updated_at'],
  posts: ['id', 'title', 'content', 'user_id', 'published_at'],
  comments: ['id', 'content', 'post_id', 'user_id', 'created_at'],
  categories: ['id', 'name', 'description'],
}

const meta: Meta<typeof ColumnCard> = {
  title: 'SQLite/ColumnCard',
  component: ColumnCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    columnData: {
      description: 'Column configuration data',
    },
    tables: {
      description: 'Available tables for foreign key relationships',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const NewColumn: Story = {
  name: 'New Column (Yellow State)',
  args: {
    columnData: {
      name: 'user_id',
      type: 'integer',
      new: true,
      notNull: false,
      unique: false,
      primaryKey: false,
      min: undefined,
      max: undefined,

      defaultValue: {
        mode: 'none',
        value: undefined,
      },
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: {},
  },
}

export const BasicTextColumn: Story = {
  args: {
    columnData: {
      name: 'title',
      type: 'text',
      new: false,
      notNull: true,
      unique: false,
      primaryKey: false,
      min: 1,
      max: 255,
      defaultValue: {
        mode: 'value',
        value: 'Untitled',
      },
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: mockTables,
  },
}

export const PrimaryKeyColumn: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'integer',
      new: false,
      notNull: true,
      unique: true,
      primaryKey: true,
      defaultValue: {
        mode: 'sql',
        value: 'AUTOINCREMENT',
      },
      min: undefined,
      max: undefined,
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: mockTables,
  },
}

export const ForeignKeyColumn: Story = {
  args: {
    columnData: {
      name: 'user_id',
      type: 'integer',
      new: false,
      notNull: true,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'none',
        value: undefined,
      },
      min: undefined,
      max: undefined,
      foreignKey: {
        table: 'users',
        column: 'id',
      },
    },
    tables: mockTables,
  },
}

export const NumericWithRange: Story = {
  name: 'Numeric Column with Min/Max',
  args: {
    columnData: {
      name: 'rating',
      type: 'numeric',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      min: 1,
      max: 5,

      defaultValue: {
        mode: 'value',
        value: '3',
      },
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: mockTables,
  },
}

export const UniqueEmailColumn: Story = {
  args: {
    columnData: {
      name: 'email',
      type: 'text',
      new: false,
      notNull: true,
      unique: true,
      primaryKey: false,
      min: 5,
      max: 320,

      defaultValue: {
        mode: 'none',
        value: undefined,
      },
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: mockTables,
  },
}

export const BlobColumn: Story = {
  args: {
    columnData: {
      name: 'avatar',
      type: 'blob',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,

      defaultValue: {
        mode: 'sql',
        value: 'NULL',
      },
      min: undefined,
      max: undefined,
      foreignKey: {
        table: null,
        column: null,
      },
    },
    tables: mockTables,
  },
}

export const TimestampColumn: Story = {
  name: 'Timestamp Column with SQL Default',
  args: {
    columnData: {
      name: 'created_at',
      type: 'text',
      new: false,
      notNull: true,
      unique: false,
      primaryKey: false,

      defaultValue: {
        mode: 'sql',
        value: 'CURRENT_TIMESTAMP',
      },
      foreignKey: {
        table: null,
        column: null,
      },
      min: undefined,
      max: undefined,
    },
    tables: mockTables,
  },
}

export const AllConstraintsColumn: Story = {
  name: 'Column with All Constraints',
  args: {
    columnData: {
      name: 'special_id',
      type: 'integer',
      new: false,
      notNull: true,
      unique: true,
      primaryKey: false,
      min: 1000,
      max: 9999,

      defaultValue: {
        mode: 'value',
        value: '1000',
      },
      foreignKey: {
        table: 'categories',
        column: 'id',
      },
    },
    tables: mockTables,
  },
}
