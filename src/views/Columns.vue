<template>
  <column-form v-for="(column, i) in columns" :key="column.name" :column="column" :ref="el => el && (refs[i] = el)"/>
  <!-- <button @click="runUpdate">Write Changes</button> -->
  <!-- {{ columnsUpdated }} -->
  <button @click="commit">commit</button>
  {{ isModified }}
</template>

<script lang="ts">
import { useColumn, useTables } from '@/database'
import { computed, defineComponent, ref } from 'vue'
import ColumnForm from '@/components/ColumnForm.vue'

export default defineComponent({
  components: { ColumnForm },
  props: ['name'],
  setup (props) {
    const { list } = useColumn()
    const { update } = useTables()

    const refs = ref<typeof ColumnForm[]>([])
    const columns = computed(() => list(props.name))
    const modified = computed(() => { return refs.value.map(column => column.modified) })
    const isModified = computed(() => refs.value.some(column => column.isModified))

    const commit = () => update(props.name, modified.value)

    return {
      columns,
      refs,
      modified,
      isModified,
      commit
    }
  }
})
</script>
