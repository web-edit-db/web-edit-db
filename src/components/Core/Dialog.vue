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
        <message-circle-icon v-if="mode === 'prompt'" />
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
        <v-input
          v-if="mode === 'prompt'"
          ref="inputRef"
          v-model="inputValue"
          variant="primary"
        />
      </main>
      <footer>
        <v-button
          v-if="negative || ['prompt', 'confirm'].includes(mode)"
          ref="negativeRef"
          :text="negative ?? 'cancel'"
          @click="$emit('negative') || $emit('finish')"
        />
        <!-- :variant="" -->
        <v-button
          ref="positive"
          :variant="
            positiveVariant ??
              (
                ['confirm', 'prompt'].includes(mode)
                  ? 'success'
                  : mode
              )
          "
          class="col-start-2"
          :text="positive ?? (['prompt', 'confirm'].includes(mode) ? 'Ok' : 'Got it')"
          @click="$emit('positive', inputValue) || $emit('finish')"
        />
      </footer>
    </v-label>
    <div />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { AlertCircleIcon, CircleCheckIcon, CircleXIcon, MessageCircleIcon, XIcon } from 'vue-tabler-icons'
import { VButton, VInput, VLabel } from './'

export default defineComponent({
  components: {
    VLabel,
    VButton,
    VInput,
    CircleCheckIcon,
    AlertCircleIcon,
    CircleXIcon,
    XIcon,
    MessageCircleIcon
  },
  props: {
    mode: {
      type: String as PropType<'success' | 'confirm' | 'error' | 'prompt'>,
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
    },
    initialPrompt: {
      type: String,
      default: ''
    }
  },
  emits: [
    'positive',
    'negative',
    'finish'
  ],
  setup (props) {
    const variant = computed(
      () => props.mode === 'confirm'
        ? 'warning'
        : props.mode === 'prompt'
          ? 'primary'
          : props.mode)
    const inputValue = ref(props.initialPrompt)

    const inputRef = ref<typeof VInput>()
    const negataveRef = ref<typeof VButton>()
    const positiveRef = ref<typeof VButton>()

    onMounted(() => {
      // when mounted grap focus
      const target = inputRef.value ?? negataveRef.value ?? positiveRef.value
      if (target) target.$el.focus()
    })

    return { variant, inputValue, inputRef, negataveRef, positiveRef }
  }
})
</script>

<style lang="postcss" scoped>
.dialog {
  @apply flex flex-col items-stretch gap-4;
  @apply p-5 h-auto w-96;
  @apply border-4;

  &:hover {
    @apply bg-white;
  }

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
    @apply grid grid-cols-2 gap-2 self-end grid-flow-row;
  }
}

.mask {
  @apply flex justify-center items-center;
  @apply h-screen w-screen;
  @apply bg-black bg-opacity-50;
}
</style>
