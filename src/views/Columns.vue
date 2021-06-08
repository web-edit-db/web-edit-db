<template>
<section>
  <column-card v-for="(column, i) in columns" :key="column.name" :column="column" :ref="el => el && (refs[i] = el)"/>
  <footer>
    <form-button value="Apply Changes" color="green" @click="commit" :disabled="!isModified"/>
    <form-button value="Disscard Changes" color="red" :disabled="!isModified"/>
  </footer>
</section>
</template>

<script lang="ts">
import { useColumn, useTables } from '@/database'
import { computed, defineComponent, ref } from 'vue'
import ColumnCard from '@/components/ColumnCard.vue'
import FormButton from '@/components/Form/Button.vue'

export default defineComponent({
  components: { ColumnCard, FormButton },
  props: ['name'],
  setup (props) {
    const { list } = useColumn()
    const { update } = useTables()

    const refs = ref<typeof ColumnCard[]>([])
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

<style lang="postcss" scoped>
section {
  @apply max-w-6xl mx-auto;
}

footer {
  @apply m-3;
  @apply flex gap-2.5;

  & > button {
    @apply shadow-md;
  }
}
</style>
