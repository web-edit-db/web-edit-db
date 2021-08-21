<template>
  <router-view :key="$route.path" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState(['modifications'])
  },
  mounted () {
    if (!(this.modifications[this.$route.params.name as string]?.new)) {
      this.queryColumns(this.$route.params.name)
    }
  },
  methods: {
    ...mapActions(['queryColumns'])
  }
})
</script>
