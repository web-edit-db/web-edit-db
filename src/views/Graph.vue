<template>
  <!-- :style="{
      backgroundSize: `${(view.zoom/1)*10}px ${(view.zoom/1)*10}px`,
      backgroundPosition: `top ${view.position.y}px left ${view.position.x}px`
    }" -->
  <div
    class="graph-root-wrapper"
    @wheel="event => {
      if (event.wheelDelta > 0 && view.zoom < 5) {
        view.zoom += 0.2
      } else if (event.wheelDelta < 0 && view.zoom > 0.5) {
        view.zoom += -0.2
      }
    }"
    @mousedown.self="event => {
      view.move = true
      view.previous = { x: gridSnap(event.clientX), y: gridSnap(event.clientY) }
    }"
    @mousemove="event => {
      if (view.move) {
        view.position = {
          x: view.position.x + gridSnap(event.clientX - view.previous.x),
          y: view.position.y + gridSnap(event.clientY - view.previous.y)
        }
        view.previous = { x: gridSnap(event.clientX), y: gridSnap(event.clientY) }
      }
    }"
    @mouseup="event => view.move = false"
  >
    <div
      class="graph-root"
      :style="{
        transform: `translate(${view.position.x}px, ${view.position.y}px) scale(${view.zoom})`
      }"
    >
      <template
        v-for="table, tableName in tables"
        :key="tableName"
      >
        <graph-table
          v-if="!table.new"
          :table-name="tableName"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, reactive } from 'vue'
import { useStore } from 'vuex'
import GraphTable from '@/components/GraphTable.vue'
import { gridSnap } from '@/helpers'
import { State } from '@/store/types'

export default defineComponent({
  components: {
    GraphTable
  },
  setup () {
    const store = useStore<State>()
    const tables = computed(() => store.state.modifications)
    const tablePosition = computed(() => store.state.graph)
    const view = reactive({
      zoom: 1,
      previous: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      move: false
    })
    provide('view', view)
    return {
      tables,
      tablePosition,
      view,
      gridSnap
    }
  }
})
</script>

<style lang="postcss" scoped>
.graph-root-wrapper {
  @apply overflow-hidden;
  @apply h-full w-full;
  /* background-size: 10px 10px;
  background-image:
  linear-gradient(to right, theme('colors.gray.300') 2px, transparent 2px),
  linear-gradient(to bottom, theme('colors.gray.300') 2px, transparent 2px); */
}

.graph-root {
  @apply relative;
  @apply overflow-visible;
}
</style>
