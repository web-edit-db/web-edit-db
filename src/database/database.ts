import { computed, reactive, ref } from 'vue'
import sqliteInit, { Database } from 'sql.js'
import { fileOpen, fileSave, FileSystemHandle } from 'browser-fs-access'

const SQLITE_EXTENSIONS = ['.db', '.sqlite', '.sqlite3']

interface DatabaseFile extends Database {
  handle?: FileSystemHandle,
  name?: string
}

const sql = sqliteInit({
  locateFile: file => `/js/${file}`
})
export const database = ref<DatabaseFile|undefined>(undefined)

export default function useDatabase () {
  const loaded = computed(() => !!database.value)
  const name = computed(() => database.value?.name)

  const create = async () => {
    database.value = reactive(new (await sql).Database())
    database.value.name = 'database.db'
  }
  const open = async () => {
    // prompt the user for database file
    const file = await fileOpen({
      mimeTypes: ['application/vnd.sqlite3'],
      extensions: SQLITE_EXTENSIONS
    })
    // turn file into array
    const fileBufferArray = new Uint8Array(await file.arrayBuffer())
    // create a new Database instance from the file
    database.value = reactive(new (await sql).Database(fileBufferArray))
    // add missing info
    database.value.handle = file.handle
    database.value.name = file.handle?.name ?? file.name
  }
  const save = async () => {
    if (database.value) {
      // create new file from the database
      const file = new File(
        [database.value.export()],
        database.value.name ?? 'database.db',
        { type: 'application/vnd.sqlite3' }
      )

      // save the file updating the handle
      database.value.handle = await fileSave(
        file,
        {
          extensions: SQLITE_EXTENSIONS,
          fileName: file.name
        },
        database.value.handle,
        false
      )
    }
  }

  return { open, save, create, name, loaded }
}
