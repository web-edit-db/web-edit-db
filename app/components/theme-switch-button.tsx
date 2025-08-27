import { Button } from './ui/button'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from '@/lib/use-theme'

export default function ThemeSwitchButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </Button>
  )
}
