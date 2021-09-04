<template>
  <div
    @click="trigger === 'click' && (show = !show)"
    @mouseover="trigger === 'hover' && (show = true)"
    @mouseleave="show = false"
  >
    <slot
      @click="$console.log('test')"
    />
    <div
      :class="{
        'hidden-wrapper': true,
        hidden: !show
      }"
      v-bind="hiddenWrapperAttrs"
    >
      <slot
        name="hidden"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    trigger: {
      type: String as PropType<'click'|'hover'>,
      default: 'click'
    },
    hiddenWrapperAttrs: {
      type: Object,
      default: () => ({})
    }
  },
  setup () {
    const show = ref(false)
    return { show }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply relative;
}

div > .hidden-wrapper {
  @apply absolute;
  @apply top-full left-0;
}
/* div > div {
  @apply absolute;
  @apply top-full;
} */
</style>
