<template>
  <div class="data-editor">
    <template v-if="selected">
      <h1>
        {{ tableName }}.{{ selected.column }} @ row {{ selected.new ? '+' : '' }} {{ selected.row + 1 }}
      </h1>
      <component
        :is="`v-${inputType}`"
        v-model="currentValue"
        :placeholder="currentValue === null ? 'null' : ''"
        variant="primary"
      />
      <v-button
        v-if="!column?.notNull"
        text="Set Null"
        variant="primary"
        @click="currentValue = null"
      />
      <v-button
        v-if="!selected?.new"
        text="Revert changes"
        variant="error"
        :disabled="currentValue === selected.value"
        @click="currentValue = undefined"
      />
    </template>
    <template v-else>
      <h1>
        Select a cell to edit it
      </h1>
    </template>
    <v-button
      class="mt-auto"
      :text="rowDeleted ? 'Restore row' : 'Delete row'"
      variant="error"
      :disabled="!selected"
      @click="deleteRow"
    />
    <v-button
      class="mb-2"
      text="Add row"
      variant="primary"
      @click="addRow"
    />
    <v-button
      text="Commit changes"
      variant="success"
      :disabled="!tableHasChanges"
      @click="commit"
    />
    <v-button
      text="Disscard changes"
      variant="error"
      :disabled="!tableHasChanges"
      @click="revertTableChanges"
    />
  </div>
</template>

<script lang="ts">
import { VButton, VGroup, VInput, VNumber } from '@/components/Core'
import { State } from '@/store/types'
import { Statement } from 'sql.js'
import { computed, ComputedRef, defineComponent, inject, PropType, triggerRef } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

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
        column: string,
        new: boolean,
        rowId: number
      }| null>,
      default: () => null
    }
  },
  setup (props) {
    const store = useStore<State>()
    const route = useRoute()
    const statment = inject<ComputedRef<Statement>>('statment')
    const tableName = computed(() => route.params.name as string)

    const currentValue = computed({
      get () {
        const updates = store.state.modifications[tableName.value].data.updates
        if (props.selected?.new) {
          return store.state.modifications[tableName.value]?.data.new[props.selected?.rowId]?.[props.selected?.column] ?? null
        } else if (props.selected && updates?.[props.selected.rowId]?.[props.selected.column] !== undefined) {
          return updates?.[props.selected.rowId]?.[props.selected.column]
        } else if (props.selected) {
          return props.selected.value
        } else {
          return undefined
        }
      },
      set (value) {
        store.commit(
          props.selected?.new ? 'setModifiedDataNew' : 'setModifiedDataUpdate',
          {
            tableName: tableName.value,
            columnName: props.selected?.column,
            [props.selected?.new ? 'newIndex' : 'rowNumber']: (props.selected?.rowId),
            updateValue:
              props.selected?.value === value && !props.selected?.new
                ? undefined
                : value
          }
        )
      }
    })

    const column = computed(() => {
      if (props.selected?.column !== undefined) {
        return store.state.tables[
          tableName.value
        ].columns?.[props.selected?.column]
      } else {
        return undefined
      }
    }
    )
    const inputType = computed(() => {
      // See https://www.sqlite.org/datatype3.html 3.1. Determination Of Column Affinity
      const type = column.value?.type?.toUpperCase()
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

    const tableHasChanges = computed(() => {
      const data = store.state.modifications[tableName.value].data
      return data.new.length > 0 || data.delete.length > 0 || Object.values(data.updates).some(value => Object.values(value).some(value => value !== undefined))
    })
    const revertTableChanges = () => {
      store.commit('setModifiedData', {
        tableName: tableName.value,
        dataValue: {
          updates: {},
          new: [],
          delete: []
        }
      })
    }
    const addRow = () => {
      store.commit('setModifiedDataNew', {
        tableName: tableName.value,
        newIndex: store.state.modifications[tableName.value].data.new.length
      })
    }
    const deleteRow = () => {
      if (props.selected && props.selected.new) {
        store.commit('deleteModifiedDataNew', {
          tableName: tableName.value,
          newIndex: props.selected.row - 1
        })
      } else if (props.selected) {
        store.commit(
          'setModifiedDataDelete',
          {
            tableName: tableName.value,
            rowNumber: props.selected.rowId
          }
        )
      }
    }
    const rowDeleted = computed(
      () => props.selected &&
       !props.selected.new &&
        store.state.modifications[tableName.value].data.delete.includes(props.selected?.row)
    )
    const commit = async () => {
      await store.dispatch(
        'alterTableData',
        { tableName: tableName.value }
      )
      if (statment) triggerRef(statment)
    }
    return { inputType, tableName, column, currentValue, tableHasChanges, revertTableChanges, commit, addRow, deleteRow, rowDeleted }
  }
})
</script>

<style lang="postcss" scoped>
.data-editor {
  @apply bg-white;
  @apply border-2 border-primary;
  @apply shadow-lg;
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
