import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import AppSideBar from './AppSideBar'
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

// Story showing sidebar content without provider wrapper
// export const ContentOnly: Story = {
//   render: () => (
//     <SidebarProvider defaultOpen={true}>
//       <div className="flex h-full">
//         <SideBar />
//         <main className="flex-1 bg-gray-50 p-4 dark:bg-gray-900">
//           <div className="max-w-2xl">
//             <h1 className="mb-4 text-2xl font-bold">Sidebar Content Demo</h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               This story shows just the sidebar content component with the provider wrapper.
//             </p>
//           </div>
//         </main>
//       </div>
//     </SidebarProvider>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story: 'Shows the SideBarContent component directly with manual provider setup.',
//       },
//     },
//   },
// }
