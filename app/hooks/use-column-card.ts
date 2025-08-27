import { useCallback, useMemo } from 'react'

// Types matching the ColumnCard component
export interface ForeignKey {
  table: string | null
  column: string | null
}

export interface ColumnDefault {
  enabled: boolean
  value: string
}

export interface Column {
  name: string
  type: string
  primaryKey: boolean
  notNull: boolean
  unique: boolean
  min?: number
  max?: number
  default: ColumnDefault
  foreign: ForeignKey
  new?: boolean
  drop?: boolean
}

export interface TableModifications {
  columns: Record<string, Column>
}

export interface ModificationsState {
  [tableName: string]: TableModifications
}

export interface TablesState {
  [tableName: string]: {
    columns: Record<string, Column>
  }
}

export interface UseColumnCardProps {
  columnName: string
  tableName: string
  initialColumn: Column
  modifications: ModificationsState
  tables: TablesState
  onModificationChange: (modifications: ModificationsState) => void
}

export function useColumnCard({
  columnName,
  tableName,
  initialColumn,
  modifications,
  tables,
  onModificationChange,
}: UseColumnCardProps) {
  // Get current column from modifications or use initial
  const column = useMemo(() => {
    return modifications[tableName]?.columns[columnName] || initialColumn
  }, [modifications, tableName, columnName, initialColumn])

  // Check if column is modified
  const isModified = useMemo(() => {
    if (!modifications[tableName]?.columns[columnName]) return false

    const modifiedColumn = modifications[tableName].columns[columnName]
    if (modifiedColumn.new || modifiedColumn.drop) return true

    // Check if any field differs from initial
    return Object.keys(modifiedColumn).some((key) => {
      if (key === 'new' || key === 'drop') return false
      return (
        JSON.stringify(modifiedColumn[key as keyof Column]) !==
        JSON.stringify(initialColumn[key as keyof Column])
      )
    })
  }, [modifications, tableName, columnName, initialColumn])

  // Update column modification
  const updateColumn = useCallback(
    (updates: Partial<Column>) => {
      const currentModifications = modifications[tableName] || { columns: {} }
      const currentColumn = currentModifications.columns[columnName] || initialColumn

      const updatedColumn = { ...currentColumn, ...updates }

      const newModifications = {
        ...modifications,
        [tableName]: {
          ...currentModifications,
          columns: {
            ...currentModifications.columns,
            [columnName]: updatedColumn,
          },
        },
      }

      onModificationChange(newModifications)
    },
    [modifications, tableName, columnName, initialColumn, onModificationChange],
  )

  // Revert column changes
  const revertColumn = useCallback(() => {
    const currentModifications = modifications[tableName]
    if (!currentModifications) return

    if (column.new) {
      // Remove the new column modification entirely
      const newColumns = { ...currentModifications.columns }
      delete newColumns[columnName]

      const newModifications = {
        ...modifications,
        [tableName]: {
          ...currentModifications,
          columns: newColumns,
        },
      }

      onModificationChange(newModifications)
    } else {
      // Revert to initial state
      const newModifications = {
        ...modifications,
        [tableName]: {
          ...currentModifications,
          columns: {
            ...currentModifications.columns,
            [columnName]: initialColumn,
          },
        },
      }

      onModificationChange(newModifications)
    }
  }, [modifications, tableName, columnName, initialColumn, onModificationChange])

  // Delete column (mark for deletion)
  const deleteColumn = useCallback(() => {
    updateColumn({ drop: !column.drop })
  }, [updateColumn, column.drop])

  // Get table options for foreign key
  const tableOptions = useMemo(() => {
    return Object.keys(tables)
  }, [tables])

  // Get column options for foreign key
  const columnOptions = useMemo(() => {
    if (!column.foreign.table || !tables[column.foreign.table]?.columns) {
      return []
    }
    return Object.keys(tables[column.foreign.table].columns)
  }, [column.foreign.table, tables])

  // Query columns for a table (simulate the Vuex action)
  const queryColumns = useCallback((tableName: string) => {
    // This would typically dispatch an action to fetch columns
    // For now, we'll assume the tables state is already populated
    console.log(`Querying columns for table: ${tableName}`)
  }, [])

  return {
    column,
    isModified,
    updateColumn,
    revertColumn,
    deleteColumn,
    tableOptions,
    columnOptions,
    queryColumns,
  }
}
