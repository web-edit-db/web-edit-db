<template>
  <column-form v-for="(column, i) in columns" :key="column.name" :column="column" :ref="(el) => el && (newColumns[i] = el.newColumn)"/>
  <!-- <pre>{{ updateSQL }}</pre> -->
  <button @click="runUpdate">Write Changes</button>
</template>

<script lang="ts">
import { useColumn, Column, useTables } from '@/database'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import ColumnForm from '@/components/ColumnForm.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: { ColumnForm },
  setup () {
    const { list } = useColumn()
    const route = useRoute()
    const { update } = useTables()

    const newColumns = ref<Column[]>([])
    // const newColumnsSQL = computed(() => newColumns.value && create(route.params.tableName as string, newColumns.value))
    const columns = computed(() => list(route.params.tableName as string))
    // const updateSQL = computed(() => update(route.params.tableName as string, newColumns.value))
    // watchEffect(() => console.log(newColumnsSQL.value))
    const runUpdate = () => {
      update(route.params.tableName as string, newColumns.value)
    }

    return {
      columns: columns,
      newColumns,
      runUpdate
      // updateSQL
    }
  }
})
</script>
