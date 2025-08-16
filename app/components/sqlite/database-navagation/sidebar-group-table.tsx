import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { useTables } from '@/lib/sqlite/use-tables'
import { PlusIcon } from 'lucide-react'
import { Link } from 'react-router'
export default function SidebarGroupTable() {
  const { tables } = useTables()
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span className="text-lg font-bold select-none">Tables</span>
        {/* show a plus for creating a new table */}
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tables.map((table) => (
            <SidebarMenuItem key={table.name}>
              <SidebarMenuButton asChild>
                <Link to={`/table/${table.name}/edit`}>{table.name}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
