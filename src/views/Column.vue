<template>
  <div>
    <template v-for="column in (table?.columns ?? [])" :key="column.name">
      {{ column }}
    </template>
  </div>
</template>

<script lang="ts">
import { useDatabase } from '@/database'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup () {
    const { tables } = useDatabase()
    const route = useRoute()
    const table = computed(() => tables.value.find((table) => table.name === route.params.tableName))
    return {
      table
    }
  }
})
</script>
