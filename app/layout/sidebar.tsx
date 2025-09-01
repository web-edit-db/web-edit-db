import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/layout/side-bar'
import SidebarGroupTable from '@/components/sqlite/database-navagation/sidebar-group-table'
import { useTables } from '@/lib/sqlite/use-tables'

export default function SidebarLayout() {
  const { tables } = useTables()
  return (
    <>
      <SidebarProvider className="flex flex-1">
        <AppSideBar>
          <SidebarGroupTable tables={tables} />
        </AppSideBar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
