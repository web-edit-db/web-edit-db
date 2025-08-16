import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar'

// Custom toggle component that mimics the Vue version
const CustomSidebarToggle = () => {
  const { open, setOpen } = useSidebar()

  return (
    <div
      className={
        `after:bg-primary absolute top-1/2 -right-6 z-20 flex w-6 -translate-y-1/2 transform cursor-pointer flex-col items-center ` +
        `after:-mt-1.5 after:block after:h-12 after:w-2 after:rounded-full after:shadow-lg after:transition-transform after:content-[''] ${open ? 'hover:after:-rotate-12' : 'hover:after:rotate-12'} ` +
        `before:bg-primary before:block before:h-12 before:w-2 before:rounded-full before:shadow-lg before:transition-transform before:content-[''] ${open ? 'hover:before:rotate-12' : 'hover:before:-rotate-12'}`
      }
      onClick={() => setOpen(!open)}
    ></div>
  )
}

export default function AppSideBar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar className="border-primary border-r-2 bg-white shadow-lg dark:bg-gray-800">
      <SidebarContent>{children}</SidebarContent>
      <CustomSidebarToggle />
    </Sidebar>
  )
}
