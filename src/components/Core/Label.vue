<template>
  <component
    :is="tag"
    :class="{
      [size]: true,
      [variant]: true,
      hollow
    }"
  >
    <slot v-bind="{ props: $props, attrs: $attrs }">
      {{ text }}
    </slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    tag: {
      type: String,
      default: 'label'
    },
    variant: {
      type: String as PropType<'default' | 'primary' | 'success' | 'error' | 'warning'| 'text'>,
      default: 'default'
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    },
    text: {
      type: String,
      default: ''
    },
    hollow: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped lang="postcss">
* {
  @apply shadow;
  @apply rounded-md;
  @apply focus:outline-none;
  @apply flex justify-start items-center;
  @apply border;
  @apply leading-none;

  /*** size ***/
  /* sm */ &.sm { @apply px-1 h-7 gap-0.5; }
  /* md */ @apply px-2 h-10 gap-1 whitespace-nowrap;
  /* lg */ &.lg { @apply px-3 h-12 gap-2 text-lg; }

  /*** variant ***/
  /* default */
  & {
    @apply text-white;
    &:hover { @apply bg-gray-500 border-gray-500; }
    &, &:active { @apply bg-gray-400 border-gray-400; }
    &:focus { @apply ring-4 ring-gray-400 ring-opacity-50; }
  }
  /* primary */
  &.primary {
    &:hover { @apply bg-primary-700 border-primary-700; }
    &, &:active { @apply bg-primary border-primary; }
    &:focus { @apply ring-primary-400 ring-opacity-50; }
  }
  /* success */
  &.success {
    &:hover { @apply bg-green-700 border-green-700; }
    &, &:active { @apply bg-green-600 border-green-600; }
    &:focus { @apply ring-green-400 ring-opacity-50; }
  }
  /* error */
  &.error {
    &:hover { @apply bg-red-700 border-red-700; }
    &, &:active { @apply bg-red-600 border-red-600; }
    &:focus { @apply ring-red-400 ring-opacity-50; }
  }
  /* warning */
  &.warning {
    &:hover { @apply bg-yellow-700 border-yellow-700; }
    &, &:active { @apply bg-yellow-600 border-yellow-600; }
    &:focus { @apply ring-yellow-400 ring-opacity-50; }
  }

  /*** hollow ***/
  &.hollow {
    &:hover { @apply bg-gray-100; }
    &, &:active { @apply bg-white text-black; }
  }

  /*** text ***/
  &.text {
    &:hover { @apply bg-gray-200; }
    &, &:active { @apply bg-transparent text-black border-none shadow-none; }
    &:focus { @apply ring-gray-400 ring-opacity-50; }
  }
}
</style>
