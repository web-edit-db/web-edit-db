import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/AppSideBar'

export default function SideBarLayout() {
  return (
    <>
      <SidebarProvider className="flex flex-1">
        <AppSideBar>
          <div className="flex-1 p-4"></div>
        </AppSideBar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
