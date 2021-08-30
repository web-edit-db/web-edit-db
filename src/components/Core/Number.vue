<template>
  <v-input-group>
    <v-input
      v-bind="{ variant, size, placeholder }"
      ref="input"
      :value="modelValue ?? value"
      @input="event => add(0)"
      @keydown.prevent.up.exact="event => add(1)"
      @keydown.prevent.down.exact="event => add(-1)"
    />
    <v-button
      v-bind="{ variant, size, hollow }"
      @click="add(-1)"
    >
      <minus-icon />
    </v-button>
    <v-button
      v-bind="{ variant, size, hollow }"
      @click="add(1)"
    >
      <plus-icon />
    </v-button>
  </v-input-group>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import VInput from './Input.vue'
import VButton from './Button.vue'
import VInputGroup from './Group.vue'
import { PlusIcon, MinusIcon } from 'vue-tabler-icons'

export default defineComponent({
  name: 'VNumber',
  components: {
    VInput,
    VButton,
    VInputGroup,
    PlusIcon,
    MinusIcon
  },
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
    modelValue: {
      type: Number,
      default: null
    },
    value: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const input = ref<typeof VInput>()
    const add = (value: number) => {
      if (input.value?.$el) {
        if ((value !== 0 || input.value.$el.value !== '')) {
          if (isNaN(+input.value.$el.value)) {
            input.value.$el.value = input.value.$el.value.replace(/[^0-9](?<!^-)/, '')
          } else {
            input.value.$el.value = +input.value.$el.value + value
          }
        }
        emit('update:modelValue', input.value.$el.value && !isNaN(+input.value.$el.value) ? +input.value.$el.value : null)
      }
    }
    return { add, input }
  }
})
</script>
