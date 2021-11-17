<template>
  <div>
    {{ columnName }}
    <graph-path
      v-if="column.foreign.table && column.foreign.column && tableColumnPositions[tableName]"
      :start="tableColumnPositions[tableName][columnName]"
      :end="tableColumnPositions[column.foreign.table]?.[column.foreign.column] ?? { ...tableColumnPositions[tableName][columnName], x: tableColumnPositions[tableName][columnName].x + 100 }"
    />
  </div>
</template>

<script lang="ts">
import { State } from '@/store/types'
import { computed, defineComponent, inject, Ref } from 'vue'
import { useStore } from 'vuex'
import GraphPath from './GraphPath.vue'
import { Point } from './GraphRoot.vue'

export default defineComponent({
  components: { GraphPath },
  props: {
    columnName: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore<State>()
    const column = computed(() => store.state.modifications[props.tableName].columns[props.columnName])
    const tableColumnPositions = inject('tableColumnPositions') as Ref<{ [tableName: string]: { [columnName: string]: Point } }>
    return { column, tableColumnPositions }
  }
})
</script>
