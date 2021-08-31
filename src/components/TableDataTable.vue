<template>
  <div
    :style="`--cols: ${headers.length + 1}; --rows: ${rows.length + 1}`"
    class="table"
    @mouseleave="hovering = selected"
  >
    <div @mouseover.self="hovering = selected" />
    <table-data-cell
      v-for="header, colId in headers"
      :key="`header-${header}`"
      :value="header"
      :header="true"
      :highlight="hovering.col === colId"
      class="top"
      @mouseover="hovering = selected"
    />
    <template
      v-for="{ value: row, new: isNew}, rowId in allRows"
      :key="rowId"
    >
      <table-data-cell
        :header="true"
        :value="isNew ? `+${rowId - rows.length + 1}` : (rowId + 1)"
        :highlight="hovering.row === rowId"
        class="left col-start-1"
        @mouseover="hovering = selected"
      />

      <table-data-cell
        v-for="column, cellId in headers"
        :key="`${rowId}-${cellId}`"
        :start="cellId === 0"
        :end="cellId === headers.length - 1"
        :value="
          updates?.[rowId]?.[column] !== undefined
            ? updates?.[rowId ]?.[column]
            : (row[column] ?? null)"
        :highlight="hovering.col === cellId && hovering.row === (rowId)"
        :selected="
          selected.new === isNew
            && selected.col === cellId
            && selected.row === (isNew ? (rowId - rows.length) : rowId)
        "
        :modified="
          updates?.[rowId]?.[headers[cellId]] !== undefined
            && updates[rowId][headers[cellId]] !== row[column]
        "
        @mouseover="hovering = { col: cellId, row: rowId }"
        @mousedown="$emit('update:selected', { new: isNew, col: cellId, row: rowId })"
      />
    </template>
    <span
      class="w-full"
      :style="`grid-row: 1 / ${allRows.length + 2}; grid-column: -1;`"
      @mouseover.self="hovering = selected"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import TableDataCell from '@/components/TableDataCell.vue'
import { useStore } from 'vuex'
import { State } from '@/store/types'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    TableDataCell
  },
  props: {
    headers: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    rows: {
      type: Array as PropType<(string|number|boolean|null)[][]>,
      default: () => []
    },
    selected: {
      type: Object as PropType<{row: number, col: number}>,
      default: () => null
    }
  },
  emits: ['update:selected'],
  setup (props) {
    const store = useStore<State>()
    const route = useRoute()
    const hovering = ref<{ row: number, col: number }>({ row: -1, col: -1 })
    const updates = computed(() => store.state.modifications[route.params.name as string].data?.updates)
    const newRows = computed(() => store.state.modifications[route.params.name as string]?.data.new ?? [])
    const allRows = computed(() => [
      ...props.rows.map(value => ({ value: value, new: false })),
      ...newRows.value.map(value => ({ value: value, new: true }))
    ])

    return { hovering, updates, newRows, allRows }
  }
})
</script>

<style lang="postcss" scoped>
div.table {
  /* @apply justify-self-start; */
  @apply max-w-full;
  @apply overflow-auto;
  @apply grid py-2;
  grid-template-columns: min-content repeat(var(--cols), min-content);
  grid-auto-rows: theme('spacing.10');
}
</style>
