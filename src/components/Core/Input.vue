<template>
  <v-label
    tag="input"
    :type="type"
    :value="modelValue"
    v-bind="$attrs"
    :hollow="true"
    @input="el => $emit('update:modelValue', el.target.value)"
  >
    <template #default />
  </v-label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VLabel from './Label.vue'

export default defineComponent({
  name: 'VInput',
  components: {
    VLabel
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String,
      default: null
    },
    hollow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
})
</script>

<style lang="postcss" scoped>
input {
  @apply w-full;

  &:disabled, &:disabled:hover {
    @apply opacity-50;
    @apply cursor-not-allowed;
    @apply bg-gray-300;
  }

  &::placeholder {
    @apply text-gray-500;
  }

  &, &:active {
    &:focus { @apply bg-gray-100; }
    &.error { @apply text-red-600; }
    &.success { @apply text-green-600; }
    &.warning { @apply text-yellow-600; }
  }
}
</style>
