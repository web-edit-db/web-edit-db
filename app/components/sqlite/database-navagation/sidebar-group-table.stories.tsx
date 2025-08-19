import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import SidebarGroupTable from './sidebar-group-table'
import { SidebarProvider } from '@/components/ui/sidebar'
import { encodeTableName } from '@/lib/sqlite/table-utils'

// Mock tables data for different scenarios
const mockTablesData: Record<string, Array<{ name: string }>> = {
  noTables: [],
  fewTables: [{ name: 'users' }, { name: 'products' }, { name: 'orders' }],
  manyTables: [
    { name: 'users' },
    { name: 'products' },
    { name: 'orders' },
    { name: 'categories' },
    { name: 'inventory' },
    { name: 'payments' },
    { name: 'shipping' },
    { name: 'reviews' },
    { name: 'wishlists' },
    { name: 'coupons' },
  ],
  specialNames: [
    { name: 'user_profiles' },
    { name: 'order-items' },
    { name: 'product_categories' },
    { name: 'special table with spaces' },
    { name: 'table-with-dashes' },
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
    tables: mockTablesData.fewTables,
  },
  argTypes: {
    tables: {
      description: 'Array of table objects with name property',
    },
  },
  decorators: [
    (Story, { args }) => {
      const tables = args.tables as Array<{ name: string }>
      const firstTable = tables[0]
      const activePath = firstTable ? `/table/${encodeTableName(firstTable.name)}/edit` : '/'
      const initialEntries = [
        ...tables.map((table) => `/table/${encodeTableName(table.name)}/edit`),
        '/',
      ]
      const initialIndex = initialEntries.indexOf(activePath)
      return (
        <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
          <SidebarProvider>
            <div className="flex h-96 w-80 border">
              <Story />
            </div>
          </SidebarProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof SidebarGroupTable>

export default meta
type Story = StoryObj<typeof meta>

export const NoTables: Story = {
  args: {
    tables: mockTablesData.noTables,
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
    tables: mockTablesData.fewTables,
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
    tables: mockTablesData.manyTables,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with many tables to test scrolling behavior.',
      },
    },
  },
}

export const SpecialTableNames: Story = {
  args: {
    tables: mockTablesData.specialNames,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with table names that contain special characters, spaces, and dashes.',
      },
    },
  },
}
