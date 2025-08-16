import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/layout/SideBar'
import { useTables } from '@/lib/sqlite/useTables'

export default function SideBarLayout() {
  const { tables } = useTables()
  return (
    <>
      <SidebarProvider className="flex flex-1">
        <AppSideBar>
          <div className="flex-1 p-4">{JSON.stringify(tables, null, 2)}</div>
        </AppSideBar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
