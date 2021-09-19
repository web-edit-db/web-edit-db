<template>
  <div
    class="graph-root-wrapper"
    @wheel="event => {
      if (event.wheelDelta > 0 && view.zoom < 5) {
        view.zoom += 0.1
      } else if (view.zoom > 0.4) {
        view.zoom += -0.1
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
          v-model:position="tablePosition[tableName]"
          :table-name="tableName"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import GraphTable from '@/components/GraphTable.vue'
import { gridSnap } from '@/helpers'

export default defineComponent({
  components: {
    GraphTable
  },
  setup () {
    const store = useStore()
    const tables = computed(() => store.state.modifications)
    const tablePosition = ref<{ [tableName: string]: { x: number, y: number } }>({})
    const view = reactive({
      zoom: 1,
      previous: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      move: false
    })
    watch(
      () => tables.value,
      () => {
        let count = 0
        for (const tableName in tables.value) {
          if (!(tableName in tablePosition.value)) tablePosition.value[tableName] = { x: (count++) * 200, y: 0 }
        }
      },
      { immediate: true }
    )
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
}

.graph-root {
  @apply relative;
  @apply overflow-visible;
}
</style>
