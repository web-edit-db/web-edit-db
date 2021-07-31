<template>
  <input
    :value="modelValue"
    :type="type"
    :class="{
      [size]: true,
      [variant]: true,
    }"
    @input="(el) => $emit('update:modelValue', el.target.value)"
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'VInput',
  props: {
    variant: {
      type: String as PropType<'default' | 'primary' | 'success' | 'error' | 'warning'>,
      default: 'default'
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup () {
    return {}
  }
})
</script>

<style lang="postcss" scoped>
input {
  @apply rounded-md;
  @apply shadow;
  @apply border-2;
  @apply outline-none;
  @apply w-full;

  @apply bg-gray-100 border-gray-600;
  &:hover, &:active { @apply bg-gray-200 border-gray-700; }
  &:focus { @apply ring-4 ring-gray-400 ring-opacity-50; }

  &.sm { @apply px-2 h-7; }
  &.md { @apply px-4 h-10; }
  &.lg { @apply px-6 h-12 text-lg; }

  &.primary {
    @apply  border-primary;
    &:hover { @apply  border-primary-700; }
    &:focus { @apply ring-primary-400 ring-opacity-50; }
  }

  &.success {
    @apply  border-green-600 text-green-600;
    &:hover { @apply border-green-700; }
    &:focus { @apply ring-green-400 ring-opacity-50; }
  }

  &.error {
    @apply border-red-600 text-red-600;
    &:hover { @apply border-red-700; }
    &:focus { @apply ring-red-400 ring-opacity-50; }
  }

  &.warning {
    @apply border-yellow-600 text-yellow-600;
    &:hover { @apply border-yellow-700; }
    &:focus { @apply ring-yellow-400 ring-opacity-50; }
  }

  &:disabled {
    @apply opacity-75;
    @apply cursor-not-allowed;
    @apply bg-gray-300;
  }

  &::placeholder {
    @apply text-gray-500;
  }
}
</style>
