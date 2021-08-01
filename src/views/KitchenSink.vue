<template>
  <main class="grid-cols-6">
    <span class="col-span-full">
      Label
    </span>
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        {},
        { hollow: true },
        { disabled: true },
        { size: 'lg' },
      ]"
      :key="`${i}-label-outer`"
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
        :key="`${i}-${j}-label-inner`"
      >
        <v-label
          text="Hello, World"
          :variant="variant"
          v-bind="attrs"
        />
      </template>
    </template>
  </main>
  <main class="lg:grid-cols-5 grid-cols-4">
    <span class="col-span-full">
      Group
    </span>
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        { vertical: true },
        { hollow: true },
        { disabled: true },
        { size: 'lg' },
      ]"
      :key="`${i}-group-outer`"
    >
      <template
        v-for="variant, j in [
          '',
          'primary',
          'success',
          'error',
          'warning',
        ]"
        :key="`${i}-${j}-group-outer`"
      >
        <v-group
          v-bind="attrs"
          :variant="variant"
        >
          <v-checkbox />
          <v-input placeholder="Hey im in a group" />
        </v-group>
      </template>
    </template>
  </main>
  <main
    class="lg:grid-cols-6 grid-cols-4"
  >
    <span class="col-span-full">
      Checkbox
    </span>
    <!-- default -->
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        {},
        { hollow: true },
        { disabled: true },
        { size: 'lg' },
      ]"
      :key="`${i}-checkbox-outer`"
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
        :key="`${i}-${j}-checkbox-outer`"
      >
        <v-checkbox
          text="Hello, World"
          :variant="variant"
          v-bind="attrs"
        />
      </template>
    </template>
  </main>
  <main class="lg:grid-cols-6 grid-cols-4">
    <span class="col-span-full">
      Button
    </span>
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
    <span class="col-span-full">
      Input
    </span>
    <template
      v-for="attrs, i in [
        { size: 'sm' },
        { },
        { placeholder: 'placeholder test!' },
        { disabled: true },
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
import VGroup from '@/components/Core/InputGroup.vue'
import VLabel from '@/components/Core/Label.vue'

export default defineComponent({
  components: {
    VButton,
    VInput,
    VCheckbox,
    VGroup,
    VLabel
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
