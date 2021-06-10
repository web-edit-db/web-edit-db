<template>
  <div>
    <header>
      <span class="name">{{ column.new ? modified.name : column.name }}</span>
      <span :class="{
        'text-blue-500': status === 'modified',
        'text-green-700': status === 'orignal',
        'text-yellow-600': status === 'new'
      }">
        {{ status }}
      </span>
      <span class="controlls">
        <icon icon='undo-alt' @click="revert"/>
      </span>
    </header>
    <main>
      <form-input
        type="text"
        label="Name"
        v-model="modified.name"
        autocomplete="off"
      />
      <form-input
        type="text"
        label="Type"
        v-model="modified.type"
        autocomplete="off"
      />
      <form-input type="checkbox" label="Not Null" v-model="modified.notNull" />
      <form-input
        type="checkbox"
        label="Primary Key"
        v-model="modified.primaryKey"
      />
      <form-input type="checkbox" label="Unique" v-model="modified.unique" />
      <form-input
        type="text"
        label="Default"
        v-model="modified.defaultValue"
        autocomplete="off"
      />
      <form-input
        type="number"
        label="Min"
        v-model="modified.min"
        autocomplete="off"
        :extraClass="{ half: true }"
      />
      <form-input
        type="number"
        label="Max"
        v-model="modified.max"
        autocomplete="off"
        :extraClass="{ half: true }"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import isEqual from 'lodash/isEqual'
import FormInput from '@/components/Form/Input.vue'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  props: ['column'],
  emits: ['revert'],
  components: {
    FormInput,
    Icon
  },
  setup (props, context) {
    const modified = ref({ ...props.column, origName: props.column.name })
    const isModified = computed(
      () =>
        !isEqual(modified.value, {
          ...props.column,
          origName: unref(props.column.name)
        })
    )

    const status = computed(() => {
      if (props.column.new) {
        return 'new'
      } else if (isModified.value) {
        return 'modified'
      } else return 'orignal'
    })

    function revert () {
      context.emit('revert', modified)
      modified.value = { origName: props.column.name, ...props.column }
    }

    return {
      modified,
      isModified,
      revert,
      status
    }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply m-3;
  @apply bg-white;
  @apply p-3;
  @apply rounded-2xl;
  @apply shadow-lg;
}

div main {
  @apply grid grid-cols-4 items-end;
}

div main label:not(.half):not(.checkbox) {
  @apply col-span-2;
}

div header {
  @apply relative;
  @apply flex justify-between;

  & .status {
    @apply absolute;
    @apply top-1/2 left-1/2;
    @apply transform -translate-x-1/2 -translate-y-1/2;
  }

  & .controlls {
    @apply flex;
    @apply gap-1;

    & fa-icon {
      @apply h-8 w-8;
      @apply rounded-md;

      &:hover {
        @apply bg-gray-200;
      }
    }
  }
}
</style>
