import { toRaw } from '@vue/runtime-core'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { GetterTree } from 'vuex'
import { State } from './types'

export default {
  tableNames (state) {
    if (state.database) { return Object.keys(state.tables) }
  },
  tableModified: (state, getters) => (tableName: string) => {
    return state.modifications[tableName]?.order?.some(columnName => getters.columnModifications(tableName, columnName)) || !isEqual(
      Object.keys(state.tables[tableName]?.columns ?? {}),
      toRaw(state.modifications[tableName]?.order)
    )
  },
  columnModifications: (state) => (tableName: string, columnName: string) => {
    const column = state.modifications[tableName]?.columns[columnName]
    if (column?.new || column.drop) {
      return true
    } else {
      const columnUnmodified = get(state.tables[tableName], ['columns', columnName], column)
      return !isEqual({
        ...column,
        default: {
          enabled: column.default.enabled,
          value: column.default.enabled ? column.default.value : null
        }
      },
      {
        ...columnUnmodified,
        default: {
          enabled: columnUnmodified.default.enabled,
          value: columnUnmodified.default.enabled ? columnUnmodified.default.value : null
        }
      })
    }
  }
} as GetterTree<State, State>
