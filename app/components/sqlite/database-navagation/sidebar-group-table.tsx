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
import { encodeTableName } from '@/lib/sqlite/table-utils'
import { PlusIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useMemo } from 'react'
import { decodeTableName } from '@/lib/sqlite/table-utils'

function SidebarGroupTableMenuItem({ table }: { table: { name: string } }) {
  const params = useParams()
  const link = useMemo(() => {
    return `/table/${encodeTableName(table.name)}/edit`
  }, [table.name])

  // Check if this table is currently active by comparing with the URL parameter
  const isActive = useMemo(() => {
    if (!params.name) return false
    const currentTableName = decodeTableName(params.name)
    return currentTableName === table.name
  }, [params.name, table.name])

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={link}>{table.name}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

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
            <SidebarGroupTableMenuItem key={table.name} table={table} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
