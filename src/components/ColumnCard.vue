<template>
  <div>
    <header>
      <span class="name">{{ column.name }}</span>
      <span :class="['status', isModified ? 'text-blue-500' : 'text-green-700']">{{ isModified ? "modified" : "original" }}</span>
      <span class="controlls"></span>
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
import { isEqual } from 'lodash'
import { useColumn } from '@/database'
import FormInput from '@/components/Form/Input.vue'

export default defineComponent({
  props: ['column'],
  components: {
    FormInput
  },
  setup (props) {
    const modified = ref({ ...props.column, origName: props.column.name })
    const isModified = computed(
      () =>
        !isEqual(modified.value, {
          ...props.column,
          origName: unref(props.column.name)
        })
    )
    const { columnToString } = useColumn()

    return {
      columnToString,
      modified,
      isModified
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
}
</style>
