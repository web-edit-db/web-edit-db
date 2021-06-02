<template>
  <header>Tables</header>
  <main>
    <table-item v-for="table in tables" :key="table" :name="table"/>
  </main>
</template>

<script lang="ts">
import { useTables } from '@/database'
import { defineComponent } from 'vue'
import TableItem from './TableItem.vue'

export default defineComponent({
  components: { TableItem },
  setup () {
    const { list } = useTables()

    return { tables: list }
  }
})
</script>

<style lang="postcss" scoped>
header {
  @apply text-xl;
}

main {
  @apply flex flex-col;
}
</style>
