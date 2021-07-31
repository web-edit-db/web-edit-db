<template>
  <main>
    <v-checkbox text="enable" />
  </main>
  <main class="lg:grid-cols-6 grid-cols-4">
    <!-- default -->
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        {},
        { hollow: true },
        { disabled: true },
        { size: 'lg' },
      ]"
      :key="`${i}-button-outer`"
    >
      <template
        v-for="variant, j in [
          '',
          'primary',
          'success',
          'error',
          'warning',
          'text'
        ]"
        :key="`${i}-${j}-button-outer`"
      >
        <v-button
          text="Hello, World"
          :variant="variant"
          v-bind="attrs"
        />
      </template>
    </template>
  </main>
  <main class="lg:grid-cols-5 grid-cols-3">
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        { },
        { disabled: true },
        { placeholder: 'placeholder test!' },
        { size: 'lg' },
      ]"
      :key="`${i}-input-outer`"
    >
      <template
        v-for="variant, j in [
          '',
          'primary',
          'success',
          'error',
          'warning',
        ]"
        :key="`${i}-${j}-input-inner`"
      >
        <v-input
          v-model="testInputs[i][j]"
          text="Hello, World"
          v-bind="attrs"
          :variant="variant"
        />
      </template>
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VButton from '@/components/Core/Button.vue'
import VInput from '@/components/Core/Input.vue'
import VCheckbox from '@/components/Core/Checkbox.vue'
export default defineComponent({
  components: {
    VButton,
    VInput,
    VCheckbox
  },
  setup () {
    const size = ref(10)
    const testInputs = ref([
      ['0-0', '0-1', '0-2', '0-3', '0-4'],
      ['1-0', '1-1', '1-2', '1-3', '1-4'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['4-0', '4-1', '4-2', '4-3', '4-4']
    ])
    return { size, testInputs }
  }
})
</script>

<style lang="postcss" scoped>
main { @apply grid gap-5 items-center justify-items-center p-10; }
</style>
