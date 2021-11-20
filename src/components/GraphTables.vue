<template>
  <g>
    <graph-table
      v-for="table, tableName in tables"
      :key="tableName"
      :ref="el => tablePositions[tableName] = { ...el?.position ?? { x: 0, y: 0, w: 0, h: 0 }, name: el?.tableName }"
      :table-name="tableName"
    />
  </g>
</template>

<script lang="ts">
import { State } from '@/store/types'
import { computed, defineComponent, inject, Ref } from 'vue'
import { useStore } from 'vuex'
import { Point } from './GraphRoot.vue'
import GraphTable from './GraphTable.vue'

export default defineComponent({
  components: { GraphTable },
  setup () {
    const store = useStore<State>()
    const tables = computed(() => store.state.modifications)
    const tablePositions = inject('tablePositions') as Ref<{ [tableName: string]: Point }>
    return { tables, tablePositions }
  }
})
</script>
