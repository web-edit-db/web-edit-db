<template>
  <v-label
    class="shadow-lg"
    tag="div"
    :variant="status"
  >
    <message-circle-icon v-if="status === 'primary'" />
    <circle-check-icon v-if="status === 'success'" />
    <alert-circle-icon v-if="status === 'warning'" />
    <info-circle-icon v-if="status === 'info'" />
    <circle-x-icon v-if="status === 'error'" />
    <span>{{ body }}</span>
  </v-label>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VLabel } from './'
import { CircleCheckIcon, AlertCircleIcon, InfoCircleIcon, CircleXIcon, MessageCircleIcon } from 'vue-tabler-icons'

export default defineComponent({
  name: 'VMessage',
  components: {
    VLabel,
    CircleCheckIcon,
    AlertCircleIcon,
    CircleXIcon,
    InfoCircleIcon,
    MessageCircleIcon
  },
  props: {
    status: {
      type: String as PropType<'primary' | 'success' | 'error' | 'warning'>,
      default: 'primary'
    },
    body: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply px-2 gap-3;
  @apply z-30;
}
</style>
