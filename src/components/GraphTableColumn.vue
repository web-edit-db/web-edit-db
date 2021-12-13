<template>
  <div class="column">
    <span>{{ columnName }}</span>
    <div class="properties">
      <span v-if="column.primaryKey">PK</span>
      <span v-if="column.unique">U</span>
      <span v-if="column.notNull">NN</span>
      <span>{{ column.type }}</span>
    </div>
    <!-- {{ column.unique }} -->
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

<style scoped lang="postcss">
div.column {
  @apply flex;
  @apply justify-between;
}

div.column span {
  @apply ellipsis;
  @apply flex-grow;
}

div.properties {
  @apply flex;
  @apply gap-1;
}

div.properties span {
  /* @apply bg-primary;
  @apply rounded;
  @apply text-sm; */
  @apply text-xs;
}
</style>
