<template>
  <div>
    <header>
      {{ column.name }} - {{ isModified ? 'modified' : 'unmodified' }}
    </header>
    <main>
      <input type="text" name="name" v-model="modified.name">
      <input type="text" name="type" v-model="modified.type">
      <input type="number" name="min" v-model="modified.min">
      <input type="number" name="max" v-model="modified.max">
      <input type="text" name="default" v-model="modified.defaultValue">
      <label>Not Null: <input type="checkbox" name="notNull" v-model="modified.notNull"></label>
      <label>PK: <input type="checkbox" name="primaryKey" v-model="modified.primaryKey"></label>
      <label>unique: <input type="checkbox" name="unique" v-model="modified.unique"></label>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import { isEqual } from 'lodash'
import { useColumn } from '@/database'

export default defineComponent({
  props: ['column'],
  setup (props) {
    const modified = ref({ ...props.column, origName: props.column.name })
    const isModified = computed(() => !isEqual(modified.value, { ...props.column, origName: unref(props.column.name) }))
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
  @apply rounded;
}

div main {
  @apply grid grid-cols-4 gap-3 justify-center items-center;
}

div input {
  @apply p-1 bg-gray-200;
}
</style>
