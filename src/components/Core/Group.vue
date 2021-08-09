<script lang="ts">
import { defineComponent, h, PropType } from 'vue'

export default defineComponent({
  name: 'VGroup',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
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
    vertical: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    modelValueMapping: {
      type: Array as PropType<('string')[]>,
      default: () => ([])
    }
  },
  emits: ['update:modelValue'],
  setup (props, { slots, emit }) {
    return () => h(
      props.tag,
      { class: { vertical: props.vertical } },
      slots.default?.().map(
        (child, i) => {
          return h(child, {
            size: props.size,
            variant: child.props?.variant ?? props.variant,
            hollow: child.props?.hollow ?? props.hollow,
            disabled: props.disabled || child.props?.disabled,
            modelValue: props.modelValue[props.modelValueMapping[i] ?? i],
            'onUpdate:modelValue': (typeof props.modelValue !== 'undefined' && ((value?: string|number|boolean) =>
              emit('update:modelValue', { ...props.modelValue, [props.modelValueMapping[i] ?? i]: value })
            ))
          })
        }
      )
    )
  }
})
</script>

<style scoped lang="postcss">
* {
  @apply flex;

  & > :deep(*) {
    @apply rounded-none;
    @apply flex-grow;
    &:focus { @apply z-10; }
    &:first-child { @apply rounded-l-md; }
    &:last-child { @apply rounded-r-md; }
  }

  & > :deep(*) {
    & .rounded-within { @apply rounded-none; }
    & .rounded-within:focus { @apply z-10; }
    &:first-child .rounded-within { @apply rounded-l-md; }
    &:last-child .rounded-within { @apply rounded-r-md; }
  }

  &.vertical {
    @apply flex-col;

    & > :deep(*) {
      @apply rounded-none;
      &:focus { @apply z-10; }
      &:first-child { @apply rounded-t-md; }
      &:last-child { @apply rounded-b-md; }
    }

    & > :deep(*) {
      & .rounded-within { @apply rounded-none; }
      & .rounded-within:focus { @apply z-10; }
      &:first-child .rounded-within { @apply rounded-t-md; }
      &:last-child .rounded-within { @apply rounded-b-md; }
    }
  }
}
</style>
