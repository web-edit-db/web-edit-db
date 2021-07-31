<template>
  <button
    :class="{
      [size]: true,
      [variant]: true,
      hollow
    }"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'VButton',
  props: {
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
button {
  @apply rounded-md;
  @apply shadow;
  @apply border-2;
  @apply outline-none;
  @apply text-white;
  @apply flex justify-center items-center;
  @apply px-4 h-10;

  &:hover { @apply bg-gray-700 border-gray-700; }
  &, &:active { @apply bg-gray-600 border-gray-600; }
  &:focus { @apply ring-4 ring-gray-400 ring-opacity-50; }

  &.sm { @apply px-2 h-7; }
  &.lg { @apply px-6 h-12 text-lg; }

  &.primary {
    &:hover { @apply bg-primary-700 border-primary-700; }
    &, &:active { @apply bg-primary border-primary; }
    &:focus { @apply ring-primary-400 ring-opacity-50; }
  }

  &.success {
    &:hover { @apply bg-green-700 border-green-700; }
    &, &:active { @apply bg-green-600 border-green-600; }
    &:focus { @apply ring-green-400 ring-opacity-50; }
  }

  &.error {
    &:hover { @apply bg-red-700 border-red-700; }
    &, &:active { @apply bg-red-600 border-red-600; }
    &:focus { @apply ring-red-400 ring-opacity-50; }
  }

  &.warning {
    &:hover { @apply bg-yellow-700 border-yellow-700; }
    &, &:active { @apply bg-yellow-600 border-yellow-600; }
    &:focus { @apply ring-yellow-400 ring-opacity-50; }
  }

  &.hollow {
    &:hover { @apply bg-gray-100; }
    &, &:active { @apply bg-white text-black; }
  }

  &.text {
    &:hover { @apply bg-gray-200 ; }
    &, &:active { @apply bg-transparent text-black border-none shadow-none; }
    &:focus { @apply ring-gray-400 ring-opacity-50; }
  }

  &:disabled {
    @apply opacity-75;
    @apply cursor-not-allowed;
  }
}
</style>
