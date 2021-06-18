import { toRaw } from '@vue/runtime-core'
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
    return column?.new || column?.drop || !isEqual(column, (state.tables[tableName]?.columns ?? {})[columnName])
  }
} as GetterTree<State, State>
