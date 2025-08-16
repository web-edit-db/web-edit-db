import NavBar from '@/components/layout/nav-bar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
