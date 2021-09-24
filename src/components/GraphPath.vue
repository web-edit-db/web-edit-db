<template>
  <path
    :d="svgPath"
    stroke="red"
    fill="none"
  />
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue'
import { FindPath } from './GraphRoot.vue'

export default defineComponent({
  props: {
    start: {
      type: Object as PropType<{ x: number, y: number }>,
      required: true
    },
    end: {
      type: Object as PropType<{ x: number, y: number }>,
      required: true
    }
  },
  setup (props) {
    const findPath = inject<FindPath>('findPath')
    const path = computed(() => findPath?.(props.start, props.end) ?? [props.start, props.end])
    const svgPath = computed(() => `M${path.value[0].x + 10} ${path.value[0].y + 10} ` + path.value.slice(1).map(point => `L${point.x + 10} ${point.y + 10}`).join(' '))
    return { svgPath }
  }
})
</script>
