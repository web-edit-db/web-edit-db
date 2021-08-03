<template>
  <v-input-group>
    <v-input
      v-bind="{ variant, size }"
      ref="input"
      :value="modelValue"
      @input="event => add(0)"
      @keydown.prevent.up="event => add(1)"
      @keydown.prevent.down="event => add(-1)"
    />
    <!-- @input="event => $emit('update:ModelValue', +event.target.value || 1)" -->
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
import VInputGroup from './InputGroup.vue'
import { PlusIcon, MinusIcon } from 'vue-tabler-icons'

export default defineComponent({
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
      default: 1
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
        emit('update:modelValue', input.value.$el.value ? +input.value.$el.value : null)
      }
    }
    return { add, input }
  }
})
</script>
