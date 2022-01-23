<template>
  <foreignObject
    :height="position.h"
    :width="position.w"
    :x="position.x"
    :y="position.y"
  >
    <div
      class="graph-table"
      @mousedown="
        () => {
          controlls.target = {
            position: getPosition,
            grid: true,
            table: tableName,
          };
        }
      "
      @mouseup="controlls.target = null"
    >
      <header>
        <span>{{ tableName }}</span>
        <v-button
          variant="text"
          size="sm"
        >
          <palette-icon />
        </v-button>
      </header>
      <graph-table-column
        v-for="(column, columnName) in columns"
        :key="columnName"
        :ref="el => el && (columnWidths[columnName] = el.width)"
        :column-name="columnName"
        :table-name="tableName"
      />
    </div>
  </foreignObject>
</template>

<script lang="ts">
import { State } from '@/store/types'
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  Ref,
  ref,
  watch
} from 'vue'
import { useStore } from 'vuex'
import GraphTableColumn from '@/components/GraphTableColumn.vue'
import { Controlls, Point } from './GraphRoot.vue'
import { graphConfig } from '@/helpers'
import { PaletteIcon } from 'vue-tabler-icons'
import { VButton } from '@/components/Core'

export default defineComponent({
  components: {
    GraphTableColumn,
    PaletteIcon,
    VButton
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
    const columnWidths = ref<{ [columnName: string]: number }>({})

    const size = computed(() => ({
      w: Math.ceil((Math.max(...Object.values(columnWidths.value), -12) + 12) / graphConfig.cell) * graphConfig.cell,
      h: (Object.keys(columns.value).length + 1) * graphConfig.cell * 2
    }))
    const position = ref({ x: 0, y: 0, h: 0, w: 0 })
    const getPosition = () => position

    const tableColumnPositions = inject('tableColumnPositions') as Ref<{ [tableName: string]: { [columnName: string]: Point } }>

    watch([columns, position], () => {
      tableColumnPositions.value[props.tableName] = Object.fromEntries(Object.entries(columns.value).map(([key], index) => [
        key,
        {
          x: position.value.x + (size.value.w / 2),
          y: position.value.y + (graphConfig.cell * 2 * (index + 1.5))
        }
      ]))
    })

    watch(size, () => (position.value = { ...position.value, ...size.value }), { flush: 'post' })
    watch(
      position,
      () => store.commit(
        'setGraphTablePosition',
        { tableName: props.tableName, position: position.value }
      ),
      { flush: 'post' }
    )

    onMounted(() => {
      if (!store.state.modifications[props.tableName].new) store.dispatch('queryColumns', props.tableName)
      position.value = {
        ...size.value,
        x: store.state.graph.tables?.[props.tableName]?.x ?? Object.keys(store.state.graph.tables).length * 200,
        y: store.state.graph.tables?.[props.tableName]?.y ?? 0
      }
    })
    return { columns, controlls, size, position, getPosition, tableColumnPositions, columnWidths }
  }
})
</script>

<style lang="postcss" scoped>
.graph-table {
  @apply flex flex-col;
  @apply p-1.5;
  @apply bg-primary;
  @apply rounded-lg;
  @apply gap-1.5;
}

.graph-table header {
  @apply flex;
  @apply justify-between items-center;
  @apply text-white;
  @apply text-lg;
  @apply leading-none;
  @apply px-1.5;
  @apply select-none;
  @apply text-white;
}

.graph-table header button {
  &:hover { @apply bg-gray-300 border-gray-300; }
  &, &:active { @apply bg-white border-white text-primary w-7; }
  &:focus { @apply ring-gray-400 ring-opacity-50; }
}
</style>
