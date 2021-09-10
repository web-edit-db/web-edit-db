import router from '@/router'
import { fileOpen, fileSave } from 'browser-fs-access'
import omit from 'lodash/omit'
import pickBy from 'lodash/pickBy'
import reduce from 'lodash/reduce'
import { ActionTree } from 'vuex'
import { columnToString, runStatement, SQLITE_EXTENSIONS } from './helpers'
import { Column, State, TableModification } from './types'

export default {
  async createDatabase ({ commit, state }) {
    if (state.sqlJs) {
      await window.$dialog.prompt(
        'Enter the name for your database',
        {
          header: 'Database name',
          initialPrompt: 'no-name.db',
          onPositive: (fileName: string) => {
            if (fileName && state.sqlJs) {
              router.push('/')
              commit('setDatabase', {
                name: fileName,
                connection: new state.sqlJs.Database()
              })
              commit('setModifications', {})
              window.$message.success(`Created new database '${state.database?.name}'`)
            }
          }
        }
      )
    }
  },
  async openDatabase ({ commit, state, dispatch }) {
    if (state.sqlJs) {
      // prompt the user for database file
      const file = await fileOpen({
        mimeTypes: ['application/vnd.sqlite3'],
        extensions: SQLITE_EXTENSIONS
      })
      router.push('/')
      // turn file into array
      const fileBufferArray = new Uint8Array(await file.arrayBuffer())
      // create the connection
      const connection = new state.sqlJs.Database(fileBufferArray)

      // commit the changes
      commit('setDatabase', {
        connection,
        name: file.name,
        handle: file.handle
      })
      dispatch('queryTables')
      window.$message.success(`Opened database '${state.database?.name}'`)
    }
  },
  async saveDatabase ({ state, commit }) {
    if (state.database) {
      // create new file from the database
      const file = new File(
        [state.database.connection.export()],
        state.database.name,
        { type: 'application/vnd.sqlite3' }
      )

      // save the file updating the handle
      const handle = await fileSave(
        file,
        {
          extensions: SQLITE_EXTENSIONS,
          fileName: file.name
        },
        state.database.handle,
        false
      )

      commit('setDatabase', {
        ...state.database,
        handle
      })
      window.$message.success('Saved successfully')
    }
  },

  async queryTables ({ state, commit }) {
    if (!state.database) return undefined
    const statement = state.database.connection.prepare(`
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
          data: {
            updates: {},
            new: [],
            delete: []
          },
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
    const statement = state.database.connection.prepare(`
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
          ...reduce(state.modifications[tableName]?.columns, (results, column, name) => {
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
        data: state.modifications[tableName]?.data,
        new: false
      }
    }
    commit('setModifications', payload)
  },

  // modifications
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
        data: {
          updates: {},
          new: [],
          delete: []
        },
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

  // table
  async alterTable ({ state, dispatch, commit }, { tableName, newTableName, columns }: {tableName: string, newTableName?: string, columns: {[name: string]: Column}}) {
    if (!state.database) return undefined
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
          FROM [${tempTableName}];`)
    }
    sql.push(`DROP TABLE [${tempTableName}]`)
    console.log(sql.join('\n\n'))
    try {
      state.database.connection.run(sql.join('\n\n'))
      state.database.connection.run('COMMIT;')
    } catch (error) {
      console.log('has error', error)
      state.database.connection.run('ROLLBACK;')
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
    if (!state.database) return undefined
    if (columns === undefined) columns = state.modifications[tableName].columns

    const sql = []
    sql.push('BEGIN TRANSACTION;')
    sql.push(`CREATE TABLE [${tableName}] (
      ${Object.values(columns).filter(column => !column.drop).map(columnToString).join(', ')}
    );`)
    try {
      state.database.connection.run(sql.join('\n\n'))
      state.database.connection.run('COMMIT;')
    } catch (error) {
      console.log('has error', error)
      state.database.connection.run('ROLLBACK;')
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
    state.database.connection.run(`DROP TABLE ${tableName}`)
    await dispatch('queryTables')
  },
  async alterTableData ({ state, commit }, { tableName, data }: { tableName: string, data?: TableModification['data'] }) {
    if (!state.database) return undefined
    if (data === undefined) data = state.modifications[tableName].data
    if (data === undefined) return undefined
    const sql = []
    sql.push('BEGIN TRANSACTION;')
    const filteredUpdates = Object.keys(data.updates).filter(key => !data?.delete.includes(+key)).map(key => +key)
    for (const rowId in data.delete) {
      sql.push(`DELETE FROM [${tableName}] WHERE ROWID = ${data.delete[rowId]};`)
    }
    for (const filteredUpdatesId in filteredUpdates) {
      sql.push(
        `UPDATE [${tableName}] SET ${Object.entries(
          data.updates[+filteredUpdates[filteredUpdatesId]]
        ).map(
          ([column, value]) => `[${column}] = ${typeof value === 'string' ? ('"' + value + '"') : value}`
        ).join(', ')} WHERE ROWID = ${filteredUpdates[filteredUpdatesId]};`
      )
    }
    for (const newId in data.new) {
      sql.push(`
        INSERT INTO [${tableName}] (${Object.keys(data.new[newId]).join(', ')})
          VALUES (${Object.values(data.new[newId]).map(value => `${typeof value === 'string' ? ('"' + value + '"') : value}`).join(', ')});
      `)
    }
    console.log(sql.join('\n'))
    try {
      state.database.connection.run(sql.join('\n\n'))
      state.database.connection.run('COMMIT;')
      commit('setModifiedData', { tableName, dataValue: { updates: {}, new: [], delete: [] } })
    } catch (error) {
      console.log('has error', error)
      state.database.connection.run('ROLLBACK;')
    }
  }
} as ActionTree<State, State>
