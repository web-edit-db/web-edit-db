import { Button } from './ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/lib/useTheme'

export default function ThemeSwitchButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </Button>
  )
}
