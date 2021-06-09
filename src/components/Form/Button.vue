<template>
  <button :class="colors[$props.color]">
    {{ value }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String
    },
    color: {
      type: String,
      default: () => 'blue'
    }
  },
  data: () => ({
    colors: {
      red: [
        'text-white',
        'bg-red-600',
        'hover:bg-red-700',
        'focus:ring-red-600',
        'focus:border-red-700'
      ],
      blue: [
        'text-white',
        'bg-blue-600',
        'hover:bg-blue-700',
        'focus:ring-blue-600',
        'focus:border-blue-700'
      ],
      orange: [
        'text-white',
        'bg-yellow-600',
        'hover:bg-yellow-700',
        'focus:ring-yellow-600',
        'focus:border-yellow-700'
      ],
      green: [
        'text-white',
        'bg-green-600',
        'hover:bg-green-700',
        'focus:ring-green-600',
        'focus:border-green-700'
      ],
      white: [
        'text-black',
        'bg-white',
        'hover:bg-gray-200',
        'focus:ring-gray-300',
        'focus:border-gray-400'
      ]
    }
  })
})
</script>

<style lang="postcss" scoped>
button {
  @apply rounded-md border-gray-50;
  @apply outline-none;
  @apply px-3 py-2;
  @apply border border-transparent;
  @apply box-content;

  &:focus {
    @apply ring ring-offset-1 ring-opacity-50;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-60;
  }
}
</style>
