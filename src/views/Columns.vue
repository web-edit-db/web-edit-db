<template>
<draggable v-model="order" :item-key="key => columns[key].name" @start="dragging = true" @end="dragging = false">
  <template #item="{ element: key }">
    <column-card :column="columns[key]" :ref="el => el && (refs[key] = el)"/>
  </template>
  <template #footer>
    <footer>
      <form-button value="Apply Changes" color="green" @click="commit" :disabled="!isModified"/>
      <form-button value="Disscard Changes" color="red" :disabled="!isModified"/>
    </footer>
  </template>
</draggable>
</template>

<script lang="ts">
import { useColumn, useTables } from '@/database'
import { computed, defineComponent, ref, watch } from 'vue'
import ColumnCard from '@/components/ColumnCard.vue'
import FormButton from '@/components/Form/Button.vue'
import draggable from 'vuedraggable'
import { isEqual, omit } from 'lodash'

export default defineComponent({
  components: { ColumnCard, draggable, FormButton },
  props: ['name'],
  setup (props) {
    const { list } = useColumn()
    const { update } = useTables()

    const refs = ref<typeof ColumnCard[]>([])
    const order = ref<number[]>([])
    const columns = computed(() => list(props.name))
    const columnsInOrder = computed(() => order.value.map(key => columns.value[key]))

    const modified = computed(() => order.value.map(key => refs.value[key]?.modified))
    const isModified = computed(() => !isEqual(
      modified.value.map((column) => omit(column, 'origName')),
      columns.value
    ))

    watch(() => list(props.name), () => (order.value = Array.from(columns.value.keys())), { immediate: true })

    const commit = () => update(props.name, modified.value)

    return {
      columns,
      columnsInOrder,
      order,
      refs,
      modified,
      isModified,
      commit
    }
  }
})
</script>

<style lang="postcss" scoped>
section {
  @apply max-w-6xl mx-auto;
}

footer {
  @apply m-3;
  @apply flex gap-2.5;

  & > button {
    @apply shadow-md;
  }
}
</style>
