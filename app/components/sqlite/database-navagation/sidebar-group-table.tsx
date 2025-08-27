import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { encodeTableName } from '@/lib/sqlite/table-utils'
import { IconPlus } from '@tabler/icons-react'
import { NavLink } from 'react-router'
import { useMemo } from 'react'

function SidebarGroupTableMenuItem({ table }: { table: { name: string } }) {
  const link = useMemo(() => {
    return `/table/${encodeTableName(table.name)}/edit`
  }, [table.name])

  return (
    <SidebarMenuItem>
      <NavLink to={link} end>
        {({ isActive }) => <SidebarMenuButton isActive={isActive}>{table.name}</SidebarMenuButton>}
      </NavLink>
    </SidebarMenuItem>
  )
}

export type SidebarGroupTableProps = {
  tables: Array<{ name: string }>
  onAddTable?: () => void
}

export default function SidebarGroupTable({ tables, onAddTable }: SidebarGroupTableProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-1 flex items-center justify-between">
        <span className="text-lg font-bold select-none">Tables</span>
        {/* show a plus for creating a new table */}
        <Button variant="ghost" size="icon" onClick={onAddTable}>
          <IconPlus className="h-4 w-4" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tables.map((table) => (
            <SidebarGroupTableMenuItem key={table.name} table={table} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
