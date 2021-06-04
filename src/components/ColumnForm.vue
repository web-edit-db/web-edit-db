<template>
  <div>
    <header>
      {{ column.name }} - {{ status}}
    </header>
    <main>
      <input type="text" name="name" v-model="newColumn.name">
      <input type="text" name="type" v-model="newColumn.type">
      <input type="number" name="min" v-model="newColumn.min">
      <input type="number" name="max" v-model="newColumn.max">
      <input type="text" name="default" v-model="newColumn.defaultValue">
      <label>Not Null: <input type="checkbox" name="notNull" v-model="newColumn.notNull"></label>
      <label>PK: <input type="checkbox" name="primaryKey" v-model="newColumn.primaryKey"></label>
      <label>unique: <input type="checkbox" name="unique" v-model="newColumn.unique"></label>
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
    const newColumn = ref({ ...props.column, _name: unref(props.column.name) })
    const status = computed(() =>
      isEqual(
        { ...newColumn.value, ref: undefined, _name: undefined },
        { ...props.column, ref: undefined, _name: undefined }
      ) ? 'unmodified' : 'modified'
    )
    const { columnToString } = useColumn()

    return {
      columnToString,
      newColumn,
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
  @apply rounded;
}

div main {
  @apply grid grid-cols-4 gap-3 justify-center items-center;
}

div input {
  @apply p-1 bg-gray-200;
}
</style>
