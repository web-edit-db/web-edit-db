import { Statement } from 'sql.js'
import { computed, ref } from 'vue'
import { database } from './database'

function runAsObject (statement: Statement) {
  const results = []
  while (statement.step()) results.push(statement.getAsObject())
  return results
}

export default function useTables () {
  const reference = ref(0) // this is used as a common references between all methods so that results are recomputed
  const list = computed(() => {
    if (!database.value) return []
    reference.value++
    const query = database.value.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    )
    return runAsObject(query).map((obj) => obj.name)
  })
  const drop = (table: string) => {
    reference.value++
    database.value && database.value.run(`DROP TABLE ${table}`)
  }
  return { list, drop, reference }
}
