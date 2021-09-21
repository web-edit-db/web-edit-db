<template>
  <div
    class="graph-table"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
    }"
    @mousedown="mouseDown"
  >
    <header>
      <span>
        {{ tableName }}
      </span>
    </header>
    <graph-table-column
      v-for="column, columnName in columns"
      :key="columnName"
    >
      {{ columnName }}
    </graph-table-column>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted } from 'vue'
import { useStore } from 'vuex'
import GraphTableColumn from './GraphTableColumn.vue'
import { gridSnap } from '@/helpers'
import { State } from '@/store/types'

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

    const view = inject<{
      zoom: number
    }>('view')
    const columns = computed(() => store.state.modifications[props.tableName].columns)
    const position = computed(() => store.state.graph[props.tableName] ?? { x: 0, y: 0 })

    let previousPosition = { x: 0, y: 0 }
    const mouseMove = (event: MouseEvent) => {
      const moveX = gridSnap((event.clientX - previousPosition.x) / (view?.zoom ?? 1))
      const moveY = gridSnap((event.clientY - previousPosition.y) / (view?.zoom ?? 1))
      const newPosition = {
        x: position.value.x + moveX,
        y: position.value.y + moveY
      }
      store.commit('setGraphTablePosition', { tableName: props.tableName, position: newPosition })
      previousPosition = { x: gridSnap(event.clientX), y: gridSnap(event.clientY) }
    }
    const mouseUp = () => {
      window.removeEventListener('mouseup', mouseUp, false)
      window.removeEventListener('mousemove', mouseMove, false)
    }
    const mouseDown = (event: MouseEvent) => {
      previousPosition = { x: event.clientX, y: event.clientY }
      window.addEventListener('mouseup', mouseUp)
      window.addEventListener('mousemove', mouseMove)
    }

    onMounted(() => store.dispatch('queryColumns', props.tableName))

    return { columns, mouseDown, position }
  }
})
</script>

<style lang="postcss" scoped>
.graph-table {
  @apply absolute;
  @apply p-2 gap-2;
  @apply bg-primary text-white;
  @apply shadow;
  @apply rounded-lg;
  @apply flex flex-col;
  @apply select-none;
  width: 200px;
}

.graph-table header {
  @apply px-2;
  @apply flex justify-between;
}
</style>
