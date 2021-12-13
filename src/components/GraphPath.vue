<template>
  <teleport to="#graph-path-layer">
    <path
      :d="svgPath"
      fill="none"
    />
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watch } from 'vue'

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
    const path = computed(() => [
      props.start,
      { x: props.start.x + (props.start.x > props.end.x ? -96 : 96), y: props.start.y },
      { x: props.end.x + (props.start.x < props.end.x ? -96 : 96), y: props.end.y },
      props.end
    ])
    watch(() => path.value, () => console.log('updated!'), { immediate: true })
    const svgPath = computed(() => `M${path.value[0].x} ${path.value[0].y} ` + path.value.slice(1).map(point => `L${point.x} ${point.y}`).join(' '))
    return { svgPath }
  }
})
</script>

<style lang="postcss" scoped>
path {
  /* @apply bg-primary-300; */
  stroke: theme('colors.primary.500');
  stroke-width: 3;
}
</style>
