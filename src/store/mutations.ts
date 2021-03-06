import cloneDeep from 'lodash/cloneDeep'
import { MutationTree } from 'vuex'
import { Column, Point, State, Table, TableModification } from './types'

const mutations: MutationTree<State> = {
  setSqlJs (state, sqlJs: State['sqlJs']) {
    state.sqlJs = sqlJs
  },
  setDatabase (state, database: State['database']) {
    state.database = database
  },
  setTables (state, tables: State['tables']) {
    state.tables = cloneDeep(tables)
  },
  setColumns (
    state,
    { tableName, columns }: { tableName: string; columns: Table['columns'] }
  ) {
    state.tables[tableName] &&
      (state.tables[tableName].columns = cloneDeep(columns))
  },
  setModifications (state, modifications: State['modifications']) {
    state.modifications = cloneDeep(modifications)
  },
  setModification (
    state,
    { tableName, modified }: { tableName: string; modified: TableModification }
  ) {
    state.modifications[tableName] = cloneDeep(modified)
  },
  setModifiedColumn (
    state,
    {
      tableName,
      columnName,
      column
    }: { tableName: string; columnName: string; column: Column }
  ) {
    state.modifications[tableName].columns[columnName] = cloneDeep(column)
  },
  setModifiedData (
    state,
    { tableName, dataValue }: { tableName: string, dataValue: TableModification['data'] }
  ) {
    state.modifications[tableName].data = dataValue
  },
  setModifiedDataUpdate (
    state,
    {
      tableName,
      columnName,
      rowNumber,
      updateValue
    }: {
      tableName: string;
      columnName: string;
      rowNumber: number;
      updateValue?: string | number | boolean | null;
    }
  ) {
    // if the row object isn't there add it
    if (
      !(rowNumber in state.modifications[tableName].data.updates)
    ) {
      state.modifications[tableName].data.updates[rowNumber] = {}
    }
    state.modifications[tableName].data.updates[rowNumber][columnName] = updateValue
  },
  setModifiedDataNew (
    state,
    {
      tableName,
      columnName,
      newIndex,
      updateValue
    }: {
      tableName: string;
      columnName?: string;
      newIndex: number;
      updateValue?: string | number | boolean | null;
    }
  ) {
    if (!state.modifications[tableName].data.new[newIndex]) {
      state.modifications[tableName].data.new[newIndex] = Object.fromEntries(
        Object.keys(state.tables[tableName].columns).map(column => ([column, null]))
      )
    }
    if (columnName) state.modifications[tableName].data.new[newIndex][columnName] = updateValue
  },
  deleteModifiedDataNew (state, { tableName, newIndex }: { tableName: string, newIndex: number }) {
    state.modifications[tableName].data.new.splice(newIndex, 1)
  },
  setModifiedDataDelete (state, { tableName, rowNumber }: { tableName: string, rowNumber: number }) {
    if (state.modifications[tableName].data.delete.includes(rowNumber)) {
      state.modifications[tableName].data.delete.splice(
        state.modifications[tableName].data.delete.indexOf(rowNumber),
        1
      )
    } else {
      state.modifications[tableName].data.delete.push(rowNumber)
    }
  },
  setGraphZoomPan (state, { zoom, pan }: { zoom: number, pan: Point }) {
    state.graph.zoom = zoom
    state.graph.pan = pan
  },
  setGraphTablePosition (state, { tableName, position }: { tableName: string, position: Point }) {
    state.graph.tables[tableName] = position
  },
  resetState (state) {
    console.log('state reset')
    state.tables = {}
    state.modifications = {}
    state.graph.zoom = 1
    state.graph.pan = { x: 0, y: 0 }
  }
}

export default mutations
