import keys from 'lodash/keys'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { GetterTree } from 'vuex'
import { State } from './types'

export default {
  tableNames (state) {
    if (state.database) { return Object.keys(state.tables) }
  },
  tableModified: (state, getters) => (tableName: string) => keys(state.modifications[tableName]?.columns).some(columnName => getters.columnModifications(tableName, columnName)) || !isEqual(
    keys(state.tables[tableName]?.columns),
    keys(state.modifications[tableName]?.columns)
  ),
  columnModifications: (state) => (tableName: string, columnName: string) => {
    const column = state.modifications[tableName]?.columns[columnName]
    if (column?.new || column?.drop) {
      return true
    } else {
      const columnUnmodified = get(state.tables[tableName], ['columns', columnName], column)
      return !isEqual({
        ...column,
        default: {
          enabled: column?.default.enabled,
          value: column?.default.enabled ? column.default.value : null
        }
      },
      {
        ...columnUnmodified,
        default: {
          enabled: columnUnmodified?.default.enabled,
          value: columnUnmodified?.default.enabled ? columnUnmodified.default.value : null
        }
      })
    }
  }
} as GetterTree<State, State>
