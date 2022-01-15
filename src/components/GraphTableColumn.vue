<template>
  <div
    :key="column.name"
    class="graph-table-column"
  >
    <div class="name">
      {{ column.name }}
    </div>
    <div class="properties">
      <div
        v-if="column.notNull"
        class="property"
      >
        NN
      </div>
      <div
        v-if="column.unique"
        class="property"
      >
        UN
      </div>
      <div
        v-if="column.primaryKey"
        class="property"
      >
        PK
      </div>
      <div class="property">
        {{ column.type }}
      </div>
    </div>
    <graph-path
      v-if="column.foreign.table && column.foreign.column && tableColumnPositions[tableName]"
      :start="tableColumnPositions[tableName][columnName]"
      :end="tableColumnPositions[column.foreign.table]?.[column.foreign.column]"
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
.graph-table-column {
  @apply bg-white;
  @apply flex;
  @apply justify-between items-center;
  @apply px-3;
  @apply rounded-lg;
  @apply select-none;
  @apply gap-1;
  height: 34px;

}

.graph-table-column .name {
  @apply text-sm;
  @apply leading-none;
  min-width: 50px;
  max-width: 100px;
  @apply ellipsis overflow-hidden;
}

.graph-table-column .properties {
  @apply flex gap-0.5;
}

.graph-table-column .property {
  @apply text-xs;
  @apply px-1 p-0.5;
  @apply bg-primary;
  @apply text-white;
  border-radius: 4px;
}

</style>
