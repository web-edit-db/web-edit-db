<template>
  <div
    :class="{
      wrapper: true,
      [variant]: true,
      [size]: true,
      hollow,
    }"
  >
    <v-input
      v-bind="{
        variant,
        size,
        hollow,
        ...$attrs
      }"
      class="rounded-within"
      :model-value="modelValue"
      @update:modelValue="value => $emit('update:modelValue', value)"
      @focus="() => showDrop = true"
      @blur="() => showDrop = false"
      @input="() => suggestionSelected = -1"
      @keydown.up.prevent="suggestionNavigation.up"
      @keydown.down.prevent="suggestionNavigation.down"
      @keydown.end.prevent="suggestionNavigation.end"
      @keydown.home.prevent="suggestionNavigation.home"
      @keydown.enter.prevent="suggestionNavigation.choose"
    />
    <v-group
      v-show="showDrop"
      v-bind="{
        variant,
        size,
        hollow
      }"
      tag="ul"
      :class="{
        [size]: true,
      }"
      vertical
    >
      <v-button
        v-for="option, i in filteredOptions"
        :key="`${option} - ${i}`"
        :class="{
          active: (i == suggestionSelected)
        }"
        tag="li"
        @mouseover="() => suggestionSelected = i"
        @mousedown="() => {
          suggestionSelected = i
          suggestionNavigation.choose()
        }"
      >
        {{ option }}
      </v-button>
    </v-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { VButton, VInput, VGroup } from '.'

export default defineComponent({
  name: 'VSuggest',
  components: {
    VButton, VInput, VGroup
  },
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<'default' | 'primary' | 'success' | 'error' | 'warning'| 'text'>,
      default: 'default'
    },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    },
    hollow: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: null
    },
    options: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const dropdown = ref<typeof VGroup>()

    const filteredOptions = computed(
      () => {
        const optionsMapped = props.options
          .map(option => [
            option,
            option
              .toLowerCase()
              .indexOf(
                props.modelValue?.toLowerCase()
              )
          ])
        const optionsMappedFiltered = optionsMapped.filter(value => value[1] > -1)
        return (
          optionsMappedFiltered.length
            ? optionsMappedFiltered
            : optionsMapped
        ).sort((a, b) =>
          // sort by the position of the match in the string
          // if they are equal sort alphabetically
          a[1] > b[1]
            ? 1
            : a[1] < b[1]
              ? -1
              : a[0] > b[0]
                ? 1
                : -1
        )
          .map(value => value[0])
      }
    )
    const showDrop = ref(false)
    const suggestionSelected = ref(-1)
    const suggestionNavigation = {
      start () {
        showDrop.value = true
      },
      finish () {
        if (dropdown.value && dropdown.value.$el.querySelector('.active')) {
          dropdown.value.$el.querySelector('.active').scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
          })
        }
      },
      up () {
        suggestionNavigation.start()
        if (suggestionSelected.value > 0) {
          suggestionSelected.value -= 1
        } else {
          suggestionSelected.value = filteredOptions.value.length
        }
        suggestionNavigation.finish()
      },
      down () {
        suggestionNavigation.start()
        if (suggestionSelected.value < filteredOptions.value.length - 1) {
          suggestionSelected.value += 1
        } else {
          suggestionSelected.value = -1
        }
        suggestionNavigation.finish()
      },
      end () {
        suggestionNavigation.start()
        suggestionSelected.value = filteredOptions.value.length - 1
        suggestionNavigation.finish()
      },
      home () {
        suggestionNavigation.start()
        suggestionSelected.value = 0
        suggestionNavigation.finish()
      },
      choose () {
        emit(
          'update:modelValue',
          filteredOptions.value[suggestionSelected.value] ?? props.modelValue
        )
      }
    }
    return { filteredOptions, showDrop, suggestionSelected, suggestionNavigation }
  }
})
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply relative;
}

.wrapper.in-group {
  scale: 0.5;
}

ul {
  @apply absolute;
  @apply w-full;
  @apply z-20;
  @apply block;
  @apply overflow-x-hidden overflow-y-auto;

  &.sm {
    @apply top-9;
    height: calc(theme('spacing.7') * 6)
  }
  &.md {
    @apply top-12;
    height: calc(theme('spacing.10') * 6)
  }
  &.lg {
    @apply top-14;
    height: calc(theme('spacing.12') * 6)
  }
}

li {
  &:hover { @apply bg-gray-400 border-gray-400; }
  &:hover.primary { @apply bg-primary border-primary; }
  &:hover.success { @apply bg-green-600 border-green-600; }
  &:hover.error { @apply bg-red-600 border-red-600; }
  &:hover.warning { @apply bg-yellow-600 border-yellow-600; }
}

li.active {
  @apply bg-gray-500;
  &.primary { @apply bg-primary-700 border-primary-700; }
  &.success { @apply bg-green-700 border-green-700; }
  &.error { @apply bg-red-700 border-red-700; }
  &.warning { @apply bg-yellow-700 border-yellow-700; }
}
</style>
