<template>
  <div>
    <div v-if="list.length" @click="drop(list[0])">Drop Top</div>
  </div>
</template>

<script lang="ts">
import { useTables } from '@/database'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const { drop, list } = useTables()

    return {
      drop,
      list
    }
  }
})
</script>
