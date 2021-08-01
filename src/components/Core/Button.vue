<template>
  <v-label
    tag="button"
    v-bind="$attrs"
    @keyup.enter="event => event.target.click()"
  >
    <template
      #default="{ props }"
    >
      <slot>
        {{ props.text }}
      </slot>
    </template>
  </v-label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VLabel from './Label.vue'

export default defineComponent({
  name: 'VButton',
  components: {
    VLabel
  }
})

</script>

<style scoped lang="postcss">
button:disabled, button:disabled:hover {
  @apply opacity-75;
  @apply cursor-not-allowed;
}
</style>
