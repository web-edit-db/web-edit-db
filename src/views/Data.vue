<template>
  <table-data-table
    v-model:selected="selected"
    :headers="columnNames"
    :rows="dataRows"
  />
  <table-data-editor
    :selected="selected.row !== -1 && selected.col !== -1 ? {
      value: dataRows[selected.row][selected.col],
      row: selected.row,
      column: columnNames[selected.col],
    } : null"
  />
  <!-- type: $store.state.tables[columnNames[selected.col]].type -->
  <!-- :selected="dataRows?.[selected.row][selected.col]"
    :row="selected.row"
    :column="columnNames?.[selected.col]"
    :type="$store.state.tables?.[columnNames[selected.col]].type" -->
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed, defineComponent, ref } from 'vue'
import { State } from '@/store/types'
import TableDataTable from '@/components/TableDataTable.vue'
import TableDataEditor from '@/components/TableDataEditor.vue'

export default defineComponent({
  components: {
    TableDataTable,
    TableDataEditor
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore<State>()
    const statment = computed(() => store.state.database?.connection.prepare(`SELECT * FROM ${props.name} LIMIT 100`))
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

    const selected = ref({ row: -1, col: -1 })
    return { columnNames, dataRows, selected }
  }
})
</script>

<style lang="postcss">
#app > main {
  /* @apply flex; */
  @apply grid;
  grid-template-columns: 1fr theme('spacing.72');
  grid-template-rows: 1fr;
  @apply items-stretch;
  @apply overflow-x-auto;
  /* @apply justify-between; */

  /* & > .table {
    @apply flex-grow;
  } */
}
</style>
