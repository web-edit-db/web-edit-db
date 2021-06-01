<template>
  <div>
    {{ list }}
    <div v-if="list.length" @click="drop(list[0])">Drop Top</div>
  </div>
</template>

<script lang="ts">
import { useTables } from '@/database'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const { list, drop } = useTables()

    return {
      list,
      drop
    }
  }
})
</script>
