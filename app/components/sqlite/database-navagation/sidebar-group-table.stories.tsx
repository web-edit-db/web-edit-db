import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import SidebarGroupTable from './sidebar-group-table'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SqliteProvider, useSqliteContext } from '@/lib/sqlite/sqlite-provider'
import { useEffect } from 'react'
import { encodeTableName } from '@/lib/sqlite/table-utils'

// Mock tables data for different scenarios
const mockTablesData: Record<string, string[]> = {
  noTables: [],
  fewTables: ['users', 'products', 'orders'],
  manyTables: [
    'users',
    'products',
    'orders',
    'categories',
    'inventory',
    'payments',
    'shipping',
    'reviews',
    'wishlists',
    'coupons',
  ],
  specialNames: [
    'user_profiles',
    'order-items',
    'product_categories',
    'special table with spaces',
    'table-with-dashes',
  ],
}

const meta = {
  title: 'SQLite/SidebarGroupTable',
  component: SidebarGroupTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sidebar component that displays a list of database tables with navigation links. Shows table names as clickable links and highlights the currently active table. Includes a plus button for creating new tables.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    mockTables: 'fewTables',
    activePath: '/',
  },
  argTypes: {
    mockTables: {
      control: { type: 'select' },
      options: Object.keys(mockTablesData),
      description: 'Which set of mock tables to display',
    },
  },
  decorators: [
    (Story, { args }) => {
      const { setDatabase, sqlite3 } = useSqliteContext()
      useEffect(() => {
        if (!sqlite3) return
        const newDatabase = new sqlite3.Database()
        // Ensure args has the correct type to access mockTables
        const mockTablesKey = (args as { mockTables: keyof typeof mockTablesData }).mockTables
        const tables = mockTablesData[mockTablesKey] || []

        // for each table in mockTablesData, create a new table
        for (const table of tables) {
          newDatabase.exec(
            `CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`,
          )
        }

        setDatabase({ database: newDatabase, fileName: 'storybook-test.db' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [sqlite3])
      return Story()
    },
    (Story, { args }) => {
      const { activePath, mockTables } = args as {
        activePath: string
        mockTables: keyof typeof mockTablesData
      }
      const tables = mockTablesData[mockTables] || []
      const initialEntries = [
        ...tables.map((table) => `/table/${encodeTableName(table)}/edit`),
        '/',
      ]
      const initialIndex = initialEntries.indexOf(activePath)
      return (
        <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
          <SidebarProvider>
            <SqliteProvider>
              <div className="flex h-96 w-80 border">
                <Story />
              </div>
            </SqliteProvider>
          </SidebarProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof SidebarGroupTable> & {
  args: {
    mockTables: keyof typeof mockTablesData
    activePath: string
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const NoTables: Story = {
  args: {
    mockTables: 'noTables',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar when no tables exist in the database.',
      },
    },
  },
}

export const FewTables: Story = {
  args: {
    mockTables: 'fewTables',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with a small number of tables.',
      },
    },
  },
}

export const ManyTables: Story = {
  args: {
    mockTables: 'manyTables',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with many tables to test scrolling behavior.',
      },
    },
  },
}

export const WithActiveTable: Story = {
  args: {
    mockTables: 'fewTables',
    activePath: `/table/${encodeTableName('users')}/edit`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with an active table highlighted (users table is active).',
      },
    },
  },
}

export const SpecialTableNames: Story = {
  args: {
    mockTables: 'specialNames',
    activePath: `/table/${encodeTableName('special table with spaces')}/edit`,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar with table names that contain special characters, spaces, and dashes. The "special table with spaces" table is active.',
      },
    },
  },
}
