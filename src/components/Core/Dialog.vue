<template>
  <div
    :class="{
      mask
    }"
    @click.self="$emit('negative') || $emit('finish')"
    @keydown.esc="$emit('negative') || $emit('finish')"
  >
    <v-label
      tag="div"
      class="dialog"
      :variant="variant"
      hollow
    >
      <header>
        <circle-check-icon v-if="mode === 'success'" />
        <alert-circle-icon v-if="mode === 'confirm'" />
        <circle-x-icon v-if="mode === 'error'" />
        <span>
          {{ header ?? mode }}
        </span>
        <v-button
          variant="text"
          class="close"
          @click="$emit('negative') || $emit('finish')"
        >
          <x-icon />
        </v-button>
      </header>
      <main>
        <slot name="body">
          {{ body }}
        </slot>
      </main>
      <footer>
        <v-button
          v-if="negative || mode === 'confirm'"
          :text="negative ?? 'cancel'"
          @click="$emit('negative') || $emit('finish')"
        />
        <!-- :variant="" -->
        <v-button
          :variant="positiveVariant ?? (mode === 'confirm' ? 'success' : mode)"
          :text="positive ?? (mode === 'confirm' ? 'Ok' : 'Got it')"
          @click="$emit('positive') || $emit('finish')"
        />
      </footer>
    </v-label>
    <div />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { VLabel, VButton } from './'
import { CircleCheckIcon, AlertCircleIcon, CircleXIcon, XIcon } from 'vue-tabler-icons'

export default defineComponent({
  components: {
    VLabel,
    VButton,
    CircleCheckIcon,
    AlertCircleIcon,
    CircleXIcon,
    XIcon
  },
  props: {
    mode: {
      type: String as PropType<'success' | 'confirm' | 'error'>,
      required: true
    },
    header: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    negative: {
      type: String,
      default: null
    },
    positive: {
      type: String,
      default: null
    },
    positiveVariant: {
      type: String as PropType<'default' | 'primary' | 'success' | 'error' | 'warning'| 'text'>,
      default: null
    },
    mask: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'positive',
    'negative',
    'finish'
  ],
  setup (props) {
    const variant = computed(() => props.mode === 'confirm' ? 'warning' : props.mode)
    return { variant }
  }
})
</script>

<style lang="postcss" scoped>
.dialog {
  @apply flex flex-col items-stretch gap-4;
  @apply p-5 h-auto w-96;
  @apply border-4;

  & header {
    @apply flex gap-2 items-center text-xl leading-none;

    & .close {
      @apply ml-auto;
    }
  }

  & main {
    @apply p-1;
    @apply flex flex-col gap-2;
  }

  & footer {
    @apply flex gap-2 justify-end;
  }
}

.mask {
  @apply flex justify-center items-center;
  @apply h-screen w-screen;
  @apply bg-black bg-opacity-50;
}
</style>
