import { fileOpen, fileSave } from 'browser-fs-access'
import omit from 'lodash/omit'
import keys from 'lodash/keys'
import pick from 'lodash/pick'
import reduce from 'lodash/reduce'
import sqljsInit from 'sql.js'
import { ActionTree } from 'vuex'
import { columnToString, runStatement, SQLITE_EXTENSIONS } from './helpers'
import { Column, State } from './types'
import { pickBy } from 'lodash'

const sqljs = sqljsInit({
  locateFile: file => `/js/${file}`
})

export default {
  async create ({ commit }) {
    commit('setDatabaseData', {
      name: 'unnamed.db',
      database: new (await sqljs).Database()
    })
  },
  async open ({ commit }) {
    // prompt the user for database file
    const file = await fileOpen({
      mimeTypes: ['application/vnd.sqlite3'],
      extensions: SQLITE_EXTENSIONS
    })
    // turn file into array
    const fileBufferArray = new Uint8Array(await file.arrayBuffer())
    // commit the changes
    commit('setDatabaseData', {
      name: file.handle?.name ?? file.name,
      handle: file.handle,
      database: new (await sqljs).Database(fileBufferArray)
    })
  },
  async save ({ state, commit }) {
    if (state.database) {
      // create new file from the database
      const file = new File(
        [state.database.export()],
        state.name ?? 'database.db',
        { type: 'application/vnd.sqlite3' }
      )

      // save the file updating the handle
      const handle = await fileSave(
        file,
        {
          extensions: SQLITE_EXTENSIONS,
          fileName: file.name
        },
        state.handle,
        false
      )

      commit('setHandle', handle)
    }
  },

  async queryTables ({ state, commit }) {
    if (!state.database) return undefined
    const statement = state.database.prepare(`
    SELECT name
        FROM sqlite_master
      WHERE type = 'table' AND
            name NOT LIKE 'sqlite_%'
      ORDER BY 1
    `)
    const tables: State['tables'] = runStatement<{ name: string }>(statement).reduce(
      (prev, { name }) => ({
        ...prev,
        [name]: {
          columns: {},
          new: false
        }
      }),
      {}
    )
    commit('setTables', tables)
    // set modified preserving modified data for tables that exist
    commit('setModifications', { ...tables, ...pickBy(state.modifications, (modification, name) => name in tables || modification.new) } as State['tables'])
  },
  async queryColumns ({ state, commit }, tableName: string) {
    if (!state.database) return undefined
    const statement = state.database.prepare(`
    SELECT info.name AS name,
           info.type AS type,
           info.[notnull] AS [notNull],
           info.dflt_value AS [default],
           info.pk AS primaryKey,
           fk_list.[table] AS foreignTable,
           fk_list.[to] AS foreignColumn,
           unique_info.name = info.name as [unique]
      FROM pragma_table_info('${tableName}') AS info
           LEFT JOIN
           pragma_foreign_key_list('${tableName}') AS fk_list ON fk_list.[from] = info.name
           LEFT JOIN
           (
               SELECT index_info.name
                 FROM pragma_index_list('${tableName}') AS index_list
                      JOIN
                      pragma_index_info(index_list.name) AS index_info
           )
           AS unique_info ON unique_info.name = info.name;

    `)
    const columns = runStatement<{
      name: string,
      type: string,
      notNull: number,
      default: string | null,
      primaryKey: number,
      foreignTable: string | null,
      foreignColumn: string | null,
      unique: 1 | null
    }>(statement).map(column => {
      const { type, max, min } = column.type.match(/^(?<type>[a-zA-Z]+)(\(((?<min>\d+), )?(?<max>\d*?)\)$)?/)?.groups ?? { type: null, max: null, min: null }
      return {
        name: column.name,
        type,
        min: min ? parseInt(min) : null,
        max: max ? parseInt(max) : null,
        unique: !!column.unique,
        primaryKey: !!column.primaryKey,
        notNull: !!column.notNull,
        default: {
          value: column.default ?? '',
          enabled: !!column.default
        },
        foreign: {
          table: column.foreignTable,
          column: column.foreignColumn
        },
        new: false,
        drop: false
      }
    }).reduce((previous, column) => ({ ...previous, [column.name]: column }), {}) as State['tables']['']['columns']
    commit('setColumns', { tableName, columns })
    // set modified columns preserving any that are already modified
    const payload: State['modifications'] = {
      ...state.modifications,
      [tableName]: {
        columns: {
          ...columns,
          ...reduce(state.modifications[tableName].columns, (results, column, name) => {
            if (column.drop) return results
            return {
              ...results,
              [column.name in columns ? column.name : name]: {
                ...column,
                default: { ...column.default, value: column.default.enabled ? column.default.value : '' },
                new: !(name in columns || column.name in columns)
              }
            }
          }, {})
        },
        new: false
      }
    }
    commit('setModifications', payload)
  },
  async addModifiedColumn ({ commit, state }, { tableName, columnName, column }: { tableName: string, columnName: string, column: Partial<Column> }) {
    if (columnName === undefined) {
      let columnNumber = 0
      do { columnNumber++ } while (Object.keys(state.modifications[tableName].columns).includes(`Column ${columnNumber}`))
      columnName = `Column ${columnNumber}`
    }
    commit('setModification', {
      tableName,
      modified: {
        ...state.modifications[tableName],
        columns: {
          ...state.modifications[tableName].columns,
          [columnName]: {
            name: columnName,
            type: 'STRING',
            min: null,
            max: null,
            unique: false,
            primaryKey: false,
            notNull: false,
            default: {
              value: null,
              enabled: false
            },
            foreign: {
              table: null,
              column: null
            },
            new: true,
            drop: false,
            ...column
          }
        }
      }
    })
  },
  async revertModifiedColumn ({ commit, state }, { tableName, columnName }) {
    commit('setModifiedColumn', { tableName, columnName, column: state.tables[tableName].columns[columnName] })
  },
  async createModification ({ commit, state }, tableName: string | undefined) {
    let tableNumber = 0
    if (tableName === undefined) {
      do {
        tableNumber++
        tableName = `Table${tableNumber}`
      } while (tableName in state.modifications)
    }
    commit('setModification', {
      tableName,
      modified: {
        columns: {},
        new: true
      }
    })
    return tableName
  },
  async renameModification ({ commit, state }, { tableName, newTableName }) {
    commit(
      'setModifications',
      reduce(
        state.modifications,
        (previous, modification, name) => ({ ...previous, [name === tableName ? newTableName : name]: modification }),
        {}
      )
    )
  },
  async alterTable ({ state, dispatch, commit }, { tableName, newTableName, columns }: {tableName: string, newTableName?: string, columns: {[name: string]: Column}}) {
    if (state.database === undefined) return undefined
    if (columns === undefined) columns = state.modifications[tableName].columns
    const columnsUpdated = Object.entries(columns).filter(([, column]) => !column.drop && !column.new).map(([old, column]) => ({ old, new: column.name }))

    const tempTableName = `${tableName}__red_sqluirrel`
    const sql = []
    sql.push('BEGIN TRANSACTION;')
    // create a temporary table
    sql.push(`CREATE TABLE [${tempTableName}] AS SELECT * FROM [${tableName}];`)
    // drop the table being edited
    sql.push(`DROP TABLE [${tableName}];`)
    // create the new table with correct name and column structure
    sql.push(`CREATE TABLE [${newTableName ?? tableName}] (
      ${Object.values(columns).filter(column => !column.drop).map(columnToString).join(', ')}
    );`)
    // if there are updated columns copy there data across
    if (columnsUpdated.length) {
      sql.push(`INSERT INTO [${newTableName ?? tableName}] (
        ${columnsUpdated.map(column => `[${column.new}]`).join(', ')}
      ) SELECT ${columnsUpdated.map(column => `[${column.old}]`).join(', ')}
          FROM ${tempTableName};`)
    }
    sql.push(`DROP TABLE [${tempTableName}]`)
    try {
      state.database.run(sql.join('\n\n'))
      state.database.run('COMMIT;')
    } catch (error) {
      console.log('has error', error)
      state.database.run('ROLLBACK;')
    }
    if (newTableName) {
      commit('setModifications', {
        ...omit(state.modifications, [tableName]),
        [newTableName]: state.modifications[tableName]
      })
    }
    await dispatch('queryTables')
    if (!newTableName) await dispatch('queryColumns', tableName)
  },
  async createTable ({ state, dispatch, commit }, { tableName, columns }: { tableName: string, columns: { [name: string]: Column }}) {
    if (state.database === undefined) return undefined
    if (columns === undefined) columns = state.modifications[tableName].columns

    const sql = []
    sql.push('BEGIN TRANSACTION;')
    sql.push(`CREATE TABLE [${tableName}] (
      ${Object.values(columns).filter(column => !column.drop).map(columnToString).join(', ')}
    );`)
    try {
      state.database.run(sql.join('\n\n'))
      state.database.run('COMMIT;')
    } catch (error) {
      console.log('has error', error)
      state.database.run('ROLLBACK;')
    }
    await dispatch('queryTables')
    await commit('setModification', {
      tableName,
      modified: {
        ...state.modifications[tableName],
        new: !(tableName in state.tables)
      }
    })
    await dispatch('queryColumns', tableName)
  },
  async renameTable ({ dispatch, state }, { tableName, newTableName }) {
    if (tableName !== newTableName) {
      await dispatch('alterTable', {
        tableName,
        newTableName,
        columns: state.tables[tableName].columns
      })
    }
  },
  async dropTable ({ state, dispatch }, tableName) {
    if (!state.database) return
    state.database.run(`DROP TABLE ${tableName}`)
    await dispatch('queryTables')
  }
} as ActionTree<State, State>
