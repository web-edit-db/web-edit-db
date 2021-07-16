import cloneDeep from 'lodash/cloneDeep'
import { MutationTree } from 'vuex'
import { State } from './types'

export default {
  setSqlJs (state, sqlJs: State['sqlJs']) {
    state.sqlJs = sqlJs
  },
  setDatabase (state, database: State['database']) {
    state.database = database
  },
  setTables (state, tables: State['tables']) {
    state.tables = cloneDeep(tables)
  },
  setColumns (state, { tableName, columns }) {
    state.tables[tableName] && (state.tables[tableName].columns = cloneDeep(columns))
  },
  setModifications (state, modifications) {
    state.modifications = cloneDeep(modifications)
  },
  setModification (state, { tableName, modified }) {
    state.modifications[tableName] = cloneDeep(modified)
  },
  setModifiedColumn (state, { tableName, columnName, column }) {
    state.modifications[tableName].columns[columnName] = cloneDeep(column)
  }
} as MutationTree<State>
