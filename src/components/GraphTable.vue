<template>
  <foreignObject
    :height="position.h"
    :width="position.w"
    :x="position.x"
    :y="position.y"
  >
    <div
      class="graph-table"
      @mousedown="() => { controlls.target = { position: getPosition, grid: true, table: tableName } }"
      @mouseup="controlls.target = null"
    >
      <header>{{ tableName }}</header>
      <graph-table-column
        v-for="column, columnName in columns"
        :key="columnName"
        :column-name="columnName"
        :table-name="tableName"
      />
    </div>
  </foreignObject>
</template>

<script lang="ts">
import { State } from '@/store/types'
import { computed, defineComponent, inject, onMounted, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import GraphTableColumn from '@/components/GraphTableColumn.vue'
import { Controlls, Point } from './GraphRoot.vue'
import { graphConfig } from '@/helpers'

export default defineComponent({
  components: {
    GraphTableColumn
  },
  props: {
    tableName: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore<State>()
    const columns = computed(() => store.state.modifications[props.tableName]?.columns ?? {})

    const controlls = inject<Controlls>('controlls')

    const size = computed(() => ({ w: 160, h: (Object.keys(columns.value).length + 1) * graphConfig.cell * 2 }))
    const position = ref({ x: 0, y: 0, h: 0, w: 0 })
    const getPosition = () => position

    const tableColumnPositions = inject('tableColumnPositions') as Ref<{ [tableName: string]: { [columnName: string]: Point } }>

    watch([columns, position], () => {
      tableColumnPositions.value[props.tableName] = Object.fromEntries(Object.entries(columns.value).map(([key], index) => [
        key,
        {
          x: position.value.x + 80,
          y: position.value.y + (graphConfig.cell * 2 * (index + 1.5))
        }
      ]))
    })

    watch(position, () => store.commit('setGraphTablePosition', { tableName: props.tableName, position: position.value }), { flush: 'post' })

    onMounted(() => {
      store.dispatch('queryColumns', props.tableName)
      if (!store.state.modifications[props.tableName].new) store.dispatch('queryColumns', props.tableName)
      position.value = {
        ...size.value,
        x: store.state.graph.tables?.[props.tableName]?.x ?? Object.keys(store.state.graph.tables).length * 192,
        y: store.state.graph.tables?.[props.tableName]?.y ?? 0
      }
      store.commit('setGraphTablePosition', { tableName: props.tableName, position: position.value })
    })
    return { columns, controlls, size, position, getPosition, tableColumnPositions }
  }
})
</script>

<style lang="postcss" scoped>
.graph-table {
  @apply shadow-md;
  @apply flex flex-col;
  @apply leading-none;
  @apply bg-primary;
  @apply rounded-lg;
  @apply select-none;
}

.graph-table header, .graph-table div {
  @apply h-6;
  @apply m-1;
  @apply leading-6;
}

.graph-table div{
  @apply bg-white text-black;
  @apply rounded;
  @apply px-3;
}

.graph-table header {
  @apply text-white;
  @apply text-lg;
  @apply px-1;
}
</style>
