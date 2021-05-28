import { computed, reactive, ref } from 'vue'
import sqliteInit, { Database } from 'sql.js'
import { fileOpen, fileSave, FileSystemHandle } from 'browser-fs-access'

const SQLITE_EXTENSIONS = ['.db', '.sqlite', '.sqlite3']

interface DatabaseFile extends Database {
  handle?: FileSystemHandle,
  name?: string
}

// sqlite3 (sql.js) as computed, it will only run once because of cache
// set locateFile to ensure it gets wasm from /js/sql-wasm.wasm
const sqlite3 = computed(async () => await sqliteInit({ locateFile: file => `/js/${file}` }))
const database = ref<DatabaseFile|undefined>(undefined)

class Column {
  name: string
  type: string
  constructor (name: string, type: string) {
    this.name = name
    this.type = type
  }
}

class Table {
  name: string
  constructor (name: string) {
    this.name = name
  }

  get columns () {
    if (database.value === undefined) return []
    return database.value.exec(`PRAGMA table_info('${this.name}')`)[0].values.map((row) => {
      return new Column(row[1] as string, row[2] as string)
    })
  }

  delete () {
    database.value && database.value.run('DROP TABLE ?', [this.name])
  }

  toString () {
    return this.name
  }
}

export function useDatabase () {
  const saveReady = computed(() => !!database.value)
  const name = computed(() => database.value?.name)
  // const version = ref<undefined|string>(undefined)

  async function create (): Promise<void> {
    // clear existing handle
    if (database.value) database.value.handle = undefined
    // create empty database
    database.value = new (await sqlite3.value).Database()
    database.value.name = 'database.db'
  }

  async function open (): Promise<void> {
    // prompt the user for a database
    const file = await fileOpen({
      mimeTypes: ['application/vnd.sqlite3'],
      extensions: SQLITE_EXTENSIONS
    })
    // create a database connection to the file
    const fileBufferArray = new Uint8Array(await file.arrayBuffer())
    database.value = new (await sqlite3.value).Database(fileBufferArray)
    database.value.handle = file.handle
    database.value.name = file.handle?.name ?? file.name
  }

  async function save (): Promise<void> {
    if (database.value) {
      const file = new File(
        [database.value.export()],
        database.value.name ?? 'database.db',
        { type: 'application/vnd.sqlite3' }
      )

      database.value.handle = await fileSave(
        file,
        { fileName: file.name, extensions: SQLITE_EXTENSIONS },
        database.value.handle,
        false
      )
    }
  }

  const tables = computed(() => {
    const results = database.value?.exec("SELECT name FROM sqlite_master WHERE type == 'table' AND name NOT LIKE 'sqlite_%' ORDER BY 1")
    const [{ values: tables }] = [
      ...results ?? [],
      { values: [] }
    ]
    return (tables.flat() as string[]).map(name => new Table(name))
  })

  const version = computed(() => {
    return database.value && database.value.exec('SELECT sqlite_version()')[0].values[0][0] as string
  })

  return { open, save, create, saveReady, name, tables, version }
}
