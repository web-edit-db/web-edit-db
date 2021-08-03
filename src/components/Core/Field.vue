<template>
  <label class="field">
    <span>
      <slot
        name="label"
      >
        <span :class="{[status]: true}">
          {{ label }}
        </span>
        <span
          v-if="required"
          :class="{ 'text-primary': true, }"
        > *</span>
      </slot>
    </span>
    <slot
      :modelValue="modelValue"
      @update:modelValue="value => $emit('update:modelValue', value)"
    >
      <component
        :is="`v-${input}`"
        v-bind="inputProps"
        u
        :model-value="modelValue"
        :variant="status"
        @update:modelValue="value => $emit('update:modelValue', value)"
      />
    </slot>
    <span
      v-for="issue, i in issues"
      :key="issue.message + i"
      :class="[issue.type, 'issue']"
    >
      {{ issue.message }}
    </span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import VCheckbox from './Checkbox.vue'
import VInput from './Input.vue'
import VNumber from './Number.vue'

export default defineComponent({
  name: 'VField',
  components: {
    VCheckbox,
    VInput,
    VNumber
  },
  props: {
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    input: {
      type: String as PropType<'input'|'checkbox'|'number'>,
      default: 'input'
    },
    inputProps: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: [
        Object,
        String,
        Boolean,
        Array,
        Number
      ],
      default: null
    },
    issues: {
      type: Array as PropType<{
        message: string,
        type: 'error' | 'warning' | 'success'
      }[]>,
      default: () => []
    },
    primary: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props) {
    const status = computed(() =>
      props.issues.find(issue => issue.type === 'error')
        ? 'error'
        : props.issues.find(issue => issue.type === 'warning')
          ? 'warning'
          : props.issues.find(issue => issue.type === 'success')
            ? 'success'
            : props.primary
              ? 'primary'
              : ''
    )
    return { status }
  }
})
</script>

<style lang="postcss" scoped>
label.field {
  @apply flex flex-col;

  & > span {
    @apply px-1;

    &.issue {
      @apply leading-tight;
      &.error { @apply text-red-600; }
      &.success { @apply text-green-600; }
      &.warning { @apply text-yellow-600; }
    }
  }
}
</style>
