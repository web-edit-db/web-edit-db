import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import AppSideBar from './SideBar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

// Mock the database hook for Storybook
const MockDatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

// Wrapper component for stories that need routing
// Using MemoryRouter to avoid conflicts with any existing Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/table/users']}>
    <MockDatabaseProvider>{children}</MockDatabaseProvider>
  </MemoryRouter>
)

const meta = {
  title: 'Components/AppSideBar',
  component: AppSideBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A sliding sidebar component with custom purple toggle indicator, inspired by the Vue TheSide component. Features table navigation and expandable sub-menus.',
      },
    },
  },
  decorators: [
    (Story) => (
      <RouterWrapper>
        <SidebarProvider>
          <Story />
          <SidebarInset>
            <main className="h-full w-full flex-1 flex-grow bg-green-100 dark:bg-green-200"></main>
          </SidebarInset>
        </SidebarProvider>
      </RouterWrapper>
    ),
  ],
} satisfies Meta<typeof AppSideBar>

export default meta
type Story = StoryObj<typeof meta>

// Default story with sidebar open
export const Default: Story = {
  args: {
    children: <div>Hello</div>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default sidebar with tables listed and custom purple toggle indicator.',
      },
    },
  },
}
