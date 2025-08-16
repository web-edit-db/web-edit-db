import NavBar from '@/components/layout/NavBar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
