import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/layout/side-bar'
import SidebarGroupTable from '@/components/sqlite/database-navagation/sidebar-group-table'

export default function SidebarLayout() {
  return (
    <>
      <SidebarProvider className="flex flex-1">
        <AppSideBar>
          <SidebarGroupTable />
        </AppSideBar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
