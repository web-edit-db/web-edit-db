import cloneDeep from 'lodash/cloneDeep'
import { MutationTree } from 'vuex'
import { State } from './types'

export default {
  setDatabaseData (state, { name, handle, database }) {
    state.name = name
    state.handle = handle
    state.database = database
  },
  setHandle (state, handle) {
    state.handle = handle
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
  // setModifiedOrder (state, { tableName, })
  // setModifiedOrder (state, { tableName, order }: { order: string[]; tableName: string }) {
  //   state.modified[tableName].order = order
  // },
  // setModifiedColumns (state, { tableName, columns }: { tableName: string, columns: State['modified']['']['columns']}) {
  //   if (state.modified[tableName]) {
  //     state.modified[tableName].columns = cloneDeep(columns)
  //   } else {
  //     state.modified[tableName] = {
  //       columns: cloneDeep(columns),
  //       order: []
  //     }
  //   }
  // },
  // setModifiedColumn (state, { tableName, columnName, column }) {
  //   state.modified[tableName].columns[columnName] = cloneDeep(column)
  // }
} as MutationTree<State>
