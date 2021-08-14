<template>
  <table>
    <tr>
      <td />
      <th
        v-for="columnName in columnNames"
        :key="columnName"
      >
        {{ columnName }}
      </th>
    </tr>
    <tr
      v-for="rowData, rowIndex in dataRows"
      :key="rowIndex"
    >
      <th>{{ rowIndex }}</th>
      <td
        v-for="cellData, cellIndex in rowData"
        :key="cellIndex"
      >
        {{ cellData }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed, defineComponent } from 'vue'
import { State } from '@/store/types'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore<State>()
    const statment = computed(() => store.state.database?.connection.prepare(`SELECT * FROM ${props.name}`))
    const columnNames = computed(() => statment.value?.getColumnNames())
    const dataRows = computed(() => {
      if (statment.value) {
        const output = []
        while (statment.value.step()) {
          const rowObject = statment.value.getAsObject()
          output.push(columnNames.value?.map(columnName => rowObject[columnName]))
        }
        statment.value.reset()
        return output
      }
      return undefined
    })
    return { columnNames, dataRows }
  }
})
</script>

<style lang="postcss" scoped>

tr:nth-child(even) {
  @apply bg-white;
}

td {
  @apply max-w-sm overflow-hidden ellipsis whitespace-nowrap;
}

td, th {
  @apply px-4 py-2;
}
</style>
