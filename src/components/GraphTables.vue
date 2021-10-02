<template>
  <g>
    <template
      v-for="table, tableName, index in tables"
      :key="tableName"
    >
      <graph-table
        v-if="!table.new"
        :ref="el => tablePositions[tableName] = el?.gridPosition ?? { x: 0, y: 0, w: 0, h: 0 }"
        :table-name="tableName"
        :starting-position="{
          x: 176 * index,
          y: 0
        }"
      />
    </template>
  </g>
</template>

<script lang="ts">
import { State } from '@/store/types'
import { computed, defineComponent, inject } from 'vue'
import { useStore } from 'vuex'
import { Point } from './GraphRoot.vue'
import GraphTable from './GraphTable.vue'

export default defineComponent({
  components: { GraphTable },
  setup () {
    const store = useStore<State>()
    const tables = computed(() => store.state.modifications)
    const tablePositions = inject('tablePositions') as { [tableName: string]: Point }
    return { tables, tablePositions }
  }
})
</script>
