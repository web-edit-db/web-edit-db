import { Link } from 'react-router'
import logo from '@/assets/logo.png'
import ThemeSwitchButton from './ThemeSwitchButton'
import UploadDatabaseButton from './sqlite/UploadDatabaseButton'
import CreateDatabaseButton from './sqlite/CreateDatabaseButton'
import DatabaseVersionButton from './sqlite/DatabaseVersionButton'

export default function NavBar() {
  return (
    <nav className="border-primary flex h-14 items-center justify-between border-b-[1.8px] bg-white px-3 shadow-lg dark:bg-gray-800">
      <Link
        to="/"
        className="text-primary flex cursor-pointer items-center text-2xl font-light select-none"
      >
        <img src={logo} alt="" className="h-14 p-1.5" />
        <span className="text-primary">Web Edit DB</span>
      </Link>
      {/* space  */}
      <div className="flex items-center gap-2">
        <UploadDatabaseButton labelText="Upload" />
        <CreateDatabaseButton labelText="Create" />
        <DatabaseVersionButton />
        <ThemeSwitchButton />
      </div>
    </nav>
  )
}
