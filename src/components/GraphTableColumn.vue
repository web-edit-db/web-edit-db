<template>
  <div>
    {{ columnName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    columnName: {
      type: String,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>
