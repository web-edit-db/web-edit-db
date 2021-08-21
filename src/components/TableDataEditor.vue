<template>
  <div class="data-editor">
    <template v-if="selected">
      <h1>
        {{ tableName }}.{{ selected.column }} @ row {{ selected.row }}
      </h1>
      <v-group
        variant="primary"
      >
        <component
          :is="`v-${inputType}`"
          :value="selected.value"
        />
        <v-button
          v-if="!column?.notNull"
          text="Set Null"
        />
      </v-group>
    </template>
    <template v-else>
      <h1>
        Select a cell to edit it
      </h1>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { VInput, VNumber, VGroup, VButton } from '@/components/Core'

export default defineComponent({
  components: {
    VInput,
    VNumber,
    VGroup,
    VButton
  },
  props: {
    selected: {
      type: Object as PropType<{
        value: string | number | boolean,
        row: number,
        column: string
      }>,
      default: () => null
    }
  },
  setup (props) {
    const store = useStore()
    const route = useRoute()
    const column = computed(() => store.state.tables[
        route.params.name as string
    ].columns?.[
        props.selected?.column
    ])
    const inputType = computed(() => {
      // See https://www.sqlite.org/datatype3.html 3.1. Determination Of Column Affinity
      const type = column.value?.type.toUpperCase()
      if (type === undefined) {
        return undefined
      } else if (type.includes('INT')) {
        // INTEGER
        return 'number'
      } else if (type.includes('CHAR') || type.includes('CLOB') || type.includes('TEXT')) {
        // TEXT
        return 'input'
      } else if (type.includes('BLOB') || type === '') {
        // BLOB
        return 'input'
      } else if (type.includes('REAL') || type.includes('FLOA') || type.includes('DOUB')) {
        // REAL
        return 'number'
      } else {
        // NUMERIC
        return 'input'
      }
    })
    const tableName = computed(() => route.params.name)
    return { inputType, tableName, column }
  }
})
</script>

<style lang="postcss" scoped>
.data-editor {
  @apply bg-white;
  @apply border-2 border-primary;
  @apply rounded-xl;
  @apply m-2;
  @apply sticky top-2;
  @apply p-5;
  @apply flex gap-3 flex-col;

  & h1 {
    @apply text-xl my-1;
  }
}
</style>
