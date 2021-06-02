import { Statement } from 'sql.js'
import { computed, ref } from 'vue'
import { database } from './database'

const reference = ref(0) // this is used as a common references between all methods so that results are recomputed

function runAsObject (statement: Statement) {
  // eslint-disable-next-line no-unused-expressions
  database.value
  const results = []
  while (statement.step()) results.push(statement.getAsObject())
  return results
}

export default function useTables () {
  const loaded = computed(() => !!database.value)
  const list = computed(() => {
    if (!database.value) return []
    // eslint-disable-next-line no-unused-expressions
    reference.value
    const query = database.value.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    )
    return runAsObject(query).map((obj) => obj.name) as string[]
  })
  const drop = (table: string) => {
    // eslint-disable-next-line no-unused-expressions
    reference.value++
    database.value && database.value.run(`DROP TABLE ${table}`)
  }
  return { list, drop, reference }
}
