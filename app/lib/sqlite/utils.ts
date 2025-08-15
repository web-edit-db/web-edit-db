import { z } from 'zod'

export const createExecSchema = <
  TColumns extends string[],
  TRowTuple extends readonly [z.ZodType, ...z.ZodType[]],
>(
  columns: [...TColumns],
  rowSchema: TRowTuple,
) => {
  return z
    .array(
      z.object({
        columns: z
          .array(z.string())
          .refine(
            (data) => {
              return data.every((column, index) => column === columns[index])
            },
            { message: 'Columns do not match' },
          )
          .transform((data) => data as TColumns),
        values: z.array(z.tuple(rowSchema)),
      }),
    )
    .length(1)
    .transform((data) => data[0])
}

export const singleResult = <
  TColumns extends string[],
  TRowTuple extends readonly [z.ZodType, ...z.ZodType[]],
>(
  schema: ReturnType<typeof createExecSchema<TColumns, TRowTuple>>,
) => {
  return schema.transform((data) => {
    return {
      columns: data.columns,
      value: data.values.length < 1 ? null : data.values[0],
    }
  })
}
