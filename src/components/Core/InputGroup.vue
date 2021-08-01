<script lang="ts">
import { defineComponent, h, PropType } from 'vue'

export default defineComponent({
  name: 'VGroup',
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
    vertical: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { slots }) {
    return () => h(
      'div',
      { class: { vertical: props.vertical } },
      slots.default?.().map(
        child => h(child, {
          size: props.size,
          variant: child.props?.variant ?? props.variant,
          hollow: child.props?.hollow ?? props.hollow,
          disabled: props.disabled || child.props?.disabled
        })
      )
    )
  }
})
</script>

<style scoped lang="postcss">
div {
  @apply flex;

  & > :deep(*) {
    @apply rounded-none border-l border-r;
    &:focus {
      @apply z-10;
    }

    &:first-child {
      @apply rounded-l-md;
      @apply border-l-2;
    }

    &:last-child {
      @apply rounded-r-md;
      @apply border-r-2;
    }
  }

  &.vertical {
    @apply flex-col;

    & > :deep(*) {
      @apply rounded-none border-2 border-t border-b;
      &:focus {
        @apply z-10;
      }

      &:first-child {
        @apply rounded-t-md;
        @apply border-t-2;
      }

      &:last-child {
        @apply rounded-b-md;
        @apply border-b-2;
      }
    }
  }
}
</style>
