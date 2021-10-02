<template>
  <foreignObject
    :height="gridPosition.h"
    :width="gridPosition.w"
    :x="gridPosition.x"
    :y="gridPosition.y"
  >
    <div
      class="graph-table"
      @mousedown="() => {
        position = gridPosition
        controlls.target = updatePosition
      }"
      @mouseup="controlls.target = null"
    >
      <header>{{ tableName }}</header>
      <graph-table-column
        v-for="column, columnName in columns"
        :key="columnName"
        :column-name="columnName"
      />
    </div>
  </foreignObject>
</template>

<script lang="ts">
import { State } from '@/store/types'
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue'
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
    const columns = computed(() => store.state.modifications[props.tableName].columns)

    const controlls = inject<Controlls>('controlls')
    const snapToGrid = inject('snapToGrid') as (point: Point) => Point

    const position = ref({ x: 0, y: 0 })
    const size = computed(() => ({ w: 160, h: (Object.keys(columns.value).length + 1) * graphConfig.cell * 2 }))
    const gridPosition = computed(() => (snapToGrid({ ...position.value, ...size.value })))
    const updatePosition = (diffrence: Point) => (position.value = { x: position.value.x + diffrence.x, y: position.value.y + diffrence.y })

    watch(() => position, () => store.commit('setGraphTablePosition', { tableName: props.tableName, position: position.value }))

    onMounted(() => {
      store.dispatch('queryColumns', props.tableName)
      position.value = store.state.graph.tables?.[props.tableName] ?? { x: Object.keys(store.state.graph.tables).length * 192, y: 0 }
      store.commit('setGraphTablePosition', { tableName: props.tableName, position: position.value })
    })
    return { columns, controlls, updatePosition, gridPosition, position }
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
