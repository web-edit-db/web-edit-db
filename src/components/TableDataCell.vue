<template>
  <div
    :class="{
      header,
      start,
      end,
      highlight,
      selected,
      modified,
      deleted,
      null: value === null
    }"
  >
    {{ value === null ? 'null' : value }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    header: {
      type: Boolean,
      default: false
    },
    start: {
      type: Boolean,
      default: false
    },
    end: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    modified: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply bg-white;
  @apply border-2;
  @apply -mr-1 mb-1;
  @apply border-gray-300;
  @apply px-2 py-1;
  @apply whitespace-nowrap;
  @apply overflow-hidden ellipsis;
  @apply cursor-pointer;
  @apply shadow-md;
  max-width: 15rem;

  &.null {
    @apply text-gray-500;
  }

  &.header {
    @apply rounded-lg;
    @apply border-2 border-primary;
    @apply mx-0.5;
    @apply text-center;
    @apply sticky;
    @apply z-20;

    &.top {
      @apply top-0;
    }

    &.left {
      @apply left-0;
    }

    &.highlight {
      @apply bg-primary-200;
    }
  }

  &.end {
    @apply rounded-r-lg;
    @apply border-r-2;
    @apply mr-0.5;
  }

  &.start {
    @apply rounded-l-lg;
    @apply border-l-2;
    @apply ml-0.5;
  }

  &.highlight {
    @apply bg-gray-200;
  }

  &.modified, &.modified.selected {
    @apply bg-primary-300;
  }

  &.deleted, &.deleted.selected {
    @apply bg-red-300;
  }

  &.selected {
    @apply border-primary;
    @apply bg-gray-200;
    @apply z-10;
  }

}
</style>
