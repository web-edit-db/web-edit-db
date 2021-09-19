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
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { useStore } from 'vuex'
import GraphTableColumn from './GraphTableColumn.vue'
import { gridSnap } from '@/helpers'

export default defineComponent({
  components: {
    GraphTableColumn
  },
  props: {
    tableName: {
      type: String,
      required: true
    },
    position: {
      type: Object as PropType<{ x: number, y: number }>,
      required: true
    }
  },
  emits: ['update:position'],
  setup (props, { emit }) {
    const store = useStore()

    const columns = computed(() => store.state.modifications[props.tableName].columns)

    let previousPosition = { x: 0, y: 0 }
    const mouseMove = (event: MouseEvent) => {
      const moveX = gridSnap(event.clientX - previousPosition.x)
      const moveY = gridSnap(event.clientY - previousPosition.y)
      const newPosition = {
        x: props.position.x + moveX,
        y: props.position.y + moveY
      }
      emit('update:position', newPosition)
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

    return { columns, mouseDown }
  }
})
</script>

<style lang="postcss" scoped>
.graph-table {
  @apply absolute;
  @apply p-2 gap-3;
  @apply bg-primary text-white;
  @apply shadow;
  @apply rounded-lg;
  @apply flex flex-col;
  @apply w-48;
  @apply select-none;
}

.graph-table header {
  @apply px-2;
  @apply flex justify-between;
}
</style>
