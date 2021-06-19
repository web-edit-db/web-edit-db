import { fileOpen, fileSave } from 'browser-fs-access'
import keys from 'lodash/keys'
import pick from 'lodash/pick'
import reduce from 'lodash/reduce'
import uniq from 'lodash/uniq'
import sqljsInit from 'sql.js'
import { ActionTree } from 'vuex'
import { columnToString, runStatement, SQLITE_EXTENSIONS } from './helpers'
import { Column, State } from './types'

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
    const tables = runStatement<{ name: string }>(statement).reduce(
      (prev, { name }) => ({ ...prev, [name]: {} }),
      {}
    )
    await commit('setTables', tables as State['tables'])
    // set modified preserving modified data for tables that exist
    await commit('setModifications', { ...tables, ...pick(state.modifications, keys(tables)) })
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
    await commit('setColumns', { tableName, columns })
    // set modified columns preserving any that are already modified
    await commit('setModifications', {
      ...state.modifications,
      [tableName]: {
        columns: {
          ...columns,
          ...reduce(state.modifications[tableName]?.columns, (results, column, name) => {
            return { ...results, [column.name in columns ? column.name : name]: { ...column, default: { ...column.default, value: column.default.enabled ? column.default.value : '' }, new: !(column.name in columns) } }
          }, {})
        },
        order: uniq([...keys(columns)])
      }
    })
  },
  addModifiedColumn ({ commit, state }, { tableName, columnName, column }: { tableName: string, columnName: string, column: Partial<Column> }) {
    if (columnName === undefined) {
      let columnNumber = 0
      do { columnNumber++ } while (Object.keys(state.tables[tableName].columns).includes(`Column ${columnNumber}`))
      columnName = `Column ${columnNumber}`
    }

    commit('setModification', {
      tableName,
      modified: {
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
        },
        order: [...state.modifications[tableName].order, columnName]
      }
    })
  },
  async alterTable ({ state, dispatch }, { tableName, newTableName, columns }: {tableName: string, newTableName?: string, columns?: Column[]}) {
    if (state.database === undefined) return undefined
    if (columns === undefined) columns = state.modifications[tableName].order.map(key => state.modifications[tableName].columns[key]).filter(column => !column.drop)
    const columnsUpdated = state.modifications[tableName].order.filter(
      columnName => !state.modifications[tableName].columns[columnName].drop && !state.modifications[tableName].columns[columnName].new
    ).map(
      key => ({ old: key, new: state.modifications[tableName].columns[key].name })
    )
    console.log(columnsUpdated)
    // const originalColumns = state.tables[tableName].columns
    const tempTableName = `${tableName}__red_sqluirrel`
    const sql = []
    sql.push('BEGIN TRANSACTION;')
    // create a temporary table
    sql.push(`CREATE TABLE [${tempTableName}] AS SELECT * FROM [${tableName}];`)
    // drop the table being edited
    sql.push(`DROP TABLE [${tableName}];`)
    // create the new table with correct name and column structure
    sql.push(`CREATE TABLE [${newTableName ?? tableName}] (
      ${columns.map(columnToString).join(', ')}
    );`)
    // if there are updated columns copy there data across
    if (columnsUpdated.length) {
      sql.push(`INSERT INTO [${newTableName ?? tableName}] (
        ${columnsUpdated.map(column => `[${column.new}]`).join(', ')}
      ) SELECT ${columnsUpdated.map(column => `[${column.old}]`).join(', ')}
          FROM ${tempTableName};`)
    }
    sql.push(`DROP TABLE [${tempTableName}]`)
    console.log(sql.join('\n\n'))
    try {
      state.database.run(sql.join('\n\n'))
      state.database.run('COMMIT;')
    } catch (error) {
      console.log('has error: ', error)
      state.database.run('ROLLBACK;')
    }
    await dispatch('queryTables')
    await dispatch('queryColumns', tableName)
  },
  renameTable ({ dispatch, state }, { tableName, newTableName }) {
    dispatch('alterTable', {
      tableName,
      newTableName,
      columns: Object.values(state.tables[tableName].columns)
    })
  },
  dropTable ({ state, dispatch }, tableName) {
    if (!state.database) return
    state.database.run(`DROP TABLE ${tableName}`)
    dispatch('queryTables')
  }
} as ActionTree<State, State>
