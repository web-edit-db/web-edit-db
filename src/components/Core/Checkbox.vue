<template>
  <v-label
    :class="{
      disabled: $attrs.disabled,
    }"
    :size="$attrs.size"
    :variant="$attrs.variant"
    :text="$attrs.text"
    :hollow="$attrs.hollow"
    :tabindex="$attrs.disabled ? -1 : 0"
    v-bind="labelAttrs"
    @keyup.enter.exact="event => event.target.click()"
  >
    <template #default="{ props }">
      <input
        type="checkbox"
        :disabled="$attrs.disabled"
        :checked="modelValue"
        @change="update"
      >
      <span class="box">
        <check-icon class="text-black" />
      </span>
      <span v-if="props.text">
        {{ props.text }}
      </span>
    </template>
  </v-label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CheckIcon } from 'vue-tabler-icons'
import VLabel from './Label.vue'

export default defineComponent({
  name: 'VCheckbox',
  components: {
    CheckIcon,
    VLabel
  },
  inheritAttrs: false,
  props: {
    labelAttrs: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (_, { emit }) {
    return {
      update: (event: Event & { target: HTMLInputElement }) => {
        emit('update:modelValue', event.target.checked)
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
label {
  @apply select-none;

  & input {
    @apply hidden;
  }

  /***** box *****/
  & > .box {
    @apply flex justify-center items-center;
    @apply rounded;
    @apply border-2;
    @apply bg-white;
  }

  /*** sizes ***/
  /* sm box */ &.sm .box { @apply w-5 h-5; }
  /* md box */ & .box { @apply w-6 h-6; }
  /* lg box */ &.lg .box { @apply w-7 h-7; }

  /*** variants ***/
  /* default */
  & {
    &:hover > .box { @apply border-gray-500; }
    & > .box, &:active > .box { @apply border-gray-400; }
  }
  /* primary */
  &.primary {
    &:hover > .box { @apply border-primary-600; }
    & > .box, &:active > .box { @apply border-primary; }
  }
  /* success */
  &.success > {
    &:hover > .box { @apply border-green-700; }
    & .box, &:active .box { @apply border-green-600; }
  }
  /* error */
  &.error {
    &:hover > .box { @apply border-red-700; }
    & .box, &:active .box { @apply border-red-600; }
  }
  /* warning */
  &.warning {
    &:hover > .box { @apply border-yellow-700; }
    & .box, &:active .box { @apply border-yellow-600; }
  }

  /* check control */
  & .box svg { @apply hidden; stroke-width: 2.5; }
  & input:checked + .box svg { @apply block; }

  &.disabled { @apply opacity-50 cursor-not-allowed select-none outline-none pointer-events-none; }

}
</style>
