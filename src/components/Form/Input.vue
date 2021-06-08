<template>
  <label :class="{ error: errors.length, [type]: true, ...extraClass }">
    <span v-if="label">
      {{ ['checkbox', 'radio'].includes(type) ? '' : label }}
    </span>
    <select
      v-if="type === 'select'"
      v-bind="$attrs"
      @input="$emit('update:modelValue', process($event.target.value))"
    >
      <option
        v-for="(option, id) in options"
        :key="id"
        :value="option.value"
        :hidden="option.hidden"
        :selected="option.value === modelValue"
      >
        {{ option.text || option }}
      </option>
    </select>
    <textarea
      v-else-if="type === 'textarea'"
      @input="$emit('update:modelValue', process($event.target.value))"
      :value="modelValue"
    >
    </textarea>
    <div v-else-if="['checkbox', 'radio'].includes(type)" class="wrapper">
      <input
        v-bind="$attrs"
        :type="type"
        @input="$emit('update:modelValue', process($event.target.checked))"
        :checked="modelValue"
      />
      <span>{{ label }}</span>
    </div>
    <input
      v-else
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', process($event.target.value))"
    />
    <span
      class="text-sm"
      v-for="(error, id) in [...errors, ...notes]"
      :key="id"
    >
      {{ error }}
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FormInput',
  inheritAttrs: false,
  methods: {
    process (value: string | number) {
      if (this.type === 'number' && !Number(value)) return undefined
      return value
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: undefined
    },
    options: {
      type: Array,
      required: false
    },
    modelValue: {
      type: [String, Boolean, Number]
    },
    errors: {
      type: Array,
      default: () => []
    },
    notes: {
      type: Array,
      default: () => []
    },
    extraClass: {
      type: Object,
      default: () => ({})
    }
  }
})
</script>

<style lang="postcss" scoped>
label {
  @apply m-2 flex flex-col;
  @apply select-none;
}

label span {
  @apply text-gray-700;
}

label input,
label select,
label textarea {
  @apply block mt-1 rounded-md border-gray-300;
  @apply transition duration-150 ease-in-out;

  &:focus {
    @apply border-blue-500 ring ring-blue-500 ring-opacity-50;
  }
}

label input[type='checkbox'],
label input[type='radio'] {
  @apply inline-block w-6 h-6 mr-1;
}

label .wrapper {
  @apply flex items-center;

  & span {
    @apply leading-none;
  }
}

label input[type='radio'] {
  @apply rounded-full;
}

label.error {
  span {
    @apply text-red-500;
  }

  input,
  select,
  textarea {
    @apply border-red-500 ring-red-200;
  }
}
</style>
