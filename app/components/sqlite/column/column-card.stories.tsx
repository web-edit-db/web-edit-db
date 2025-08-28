import type { Meta, StoryObj } from '@storybook/react-vite'
import ColumnCard from './column-card'

const mockTables = {
  users: ['id', 'name', 'email', 'created_at', 'updated_at'],
  posts: ['id', 'title', 'content', 'user_id', 'published_at'],
  comments: ['id', 'content', 'post_id', 'user_id', 'created_at'],
  categories: ['id', 'name', 'description'],
}

const meta: Meta<typeof ColumnCard> = {
  title: 'SQLite/Column/ColumnCard',
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
      type: 'Integer',
      new: true,
      notNull: false,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'none',
      },
      foreignKey: {},
    },
    tables: {},
  },
}

export const BasicTextColumn: Story = {
  args: {
    columnData: {
      name: 'title',
      type: 'Text',
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
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const PrimaryKeyColumn: Story = {
  args: {
    columnData: {
      name: 'id',
      type: 'Integer',
      new: false,
      notNull: true,
      unique: true,
      primaryKey: true,
      defaultValue: {
        mode: 'sql',
        value: 'AUTOINCREMENT',
      },
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const ForeignKeyColumn: Story = {
  args: {
    columnData: {
      name: 'user_id',
      type: 'Integer',
      new: false,
      notNull: true,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'none',
      },
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
      type: 'Numeric',
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
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const UniqueEmailColumn: Story = {
  args: {
    columnData: {
      name: 'email',
      type: 'Text',
      new: false,
      notNull: true,
      unique: true,
      primaryKey: false,
      min: 5,
      max: 320,
      defaultValue: {
        mode: 'none',
      },
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const BlobColumn: Story = {
  args: {
    columnData: {
      name: 'avatar',
      type: 'Blob',
      new: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'sql',
        value: 'NULL',
      },
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const TimestampColumn: Story = {
  name: 'Timestamp Column with SQL Default',
  args: {
    columnData: {
      name: 'created_at',
      type: 'Text',
      new: false,
      notNull: true,
      unique: false,
      primaryKey: false,
      defaultValue: {
        mode: 'sql',
        value: 'CURRENT_TIMESTAMP',
      },
      foreignKey: {},
    },
    tables: mockTables,
  },
}

export const AllConstraintsColumn: Story = {
  name: 'Column with All Constraints',
  args: {
    columnData: {
      name: 'special_id',
      type: 'Integer',
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
