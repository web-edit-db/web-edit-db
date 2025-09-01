import { z } from 'zod'

export const columnTypes = ['text', 'integer', 'numeric', 'real', 'blob'] as const

export type ModifiedState = 'original' | 'modified' | 'deleted' | 'new'

export type ColumnData = {
  new: boolean
  deleted: boolean
  name: string
  type: (typeof columnTypes)[number]
  notNull: boolean
  unique: boolean
  primaryKey: boolean
  min: number | undefined
  max: number | undefined
  defaultValue: {
    mode: 'value' | 'sql' | 'none' | 'null'
    value: string | undefined
  }
  foreignKey: {
    table: string | null
    column: string | null
  }
}

export const createColumnSchema = (tables: Record<string, string[]>) =>
  z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      type: z.enum(columnTypes, { message: 'Type is required' }),
      notNull: z.boolean(),
      unique: z.boolean(),
      primaryKey: z.boolean(),
      min: z.number({ message: 'Must be a number' }).or(z.undefined()),
      max: z.number({ message: 'Must be a number' }).or(z.undefined()),
      deleted: z.boolean(),
      new: z.boolean(),
      defaultValue: z.object({
        mode: z.enum(['value', 'sql', 'none', 'null']),
        value: z.string().or(z.undefined()),
      }),
      foreignKey: z.object({
        table: z.string().nullable(),
        column: z.string().nullable(),
      }),
    })
    .superRefine((data, ctx) => {
      // super refine for the min/max fields
      if (data.min !== undefined && data.max !== undefined) {
        const minNum = Number(data.min)
        const maxNum = Number(data.max)
        if (!Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum > maxNum) {
          ctx.addIssue({
            code: 'custom',
            message: 'Min must be less or equal to max',
            path: ['min'],
          })
          ctx.addIssue({
            code: 'custom',
            message: 'Max must be greater or equal to min',
            path: ['max'],
          })
        }
      }
    })
    .superRefine((data, ctx) => {
      const trimmedTable = data.foreignKey.table?.trim() || undefined

      if (trimmedTable === undefined) {
        return
      }

      // the table must be a valid table name
      if (!Object.keys(tables).includes(trimmedTable)) {
        ctx.addIssue({
          code: 'custom',
          message: 'No such table',
          path: ['foreignKey'],
        })
        return
      }

      // if the table is set, the column must be set
      if (data.foreignKey.column === null) {
        ctx.addIssue({
          code: 'custom',
          message: `Select a column from the table`,
          path: ['foreignKey'],
        })
        return
      }

      // the column must be a valid column name
      if (
        data.foreignKey.column !== null &&
        !tables[trimmedTable]?.includes(data.foreignKey.column)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `No such column in the table`,
          path: ['foreignKey'],
        })
        return
      }
    })
