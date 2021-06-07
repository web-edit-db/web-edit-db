<template>
  <header>
    <h4>Tables</h4>
    <icon icon='plus' />
  </header>
  <main>
    <side-table v-for="table in tables" :key="table" :name="table"/>
  </main>
</template>

<script lang="ts">
import { useTables } from '@/database'
import { defineComponent } from 'vue'
import SideTable from '@/components/Side/Table.vue'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  components: { SideTable, Icon },
  setup () {
    const { list } = useTables()

    return { tables: list }
  }
})
</script>

<style lang="postcss" scoped>
header {
  @apply px-3 py-2.5;
  @apply flex items-center;

  & h4 {
    @apply text-base;
    @apply font-medium;
    @apply leading-none;
    @apply flex-grow;
    @apply select-none;
  }

  & fa-icon {
    @apply h-7 w-7;
    @apply rounded;

    &:hover {
      @apply bg-gray-200;
    }
  }
}

main {
  @apply p-2;
}
</style>
