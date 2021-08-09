<template>
  <main class="column-card">
    <header>
      <span class="header header-name">
        {{ column.new ? column.name : columnName }}
      </span>
      <span
        :class="{
          'text-blue-500': status === 'modified',
          'text-green-700': status === 'orignal',
          'text-yellow-600': status === 'new',
          'text-red-600': status === 'delete',
          'header header-status': true,
        }"
      >
        {{ status }}
      </span>
      <span class="header header-controlls">
        <v-button
          variant="text"
          @click="column.new ? revert() : column = { ...column, drop: !column.drop } "
        >
          <component
            :is="column.drop ? 'trash-off-icon' : 'trash-icon'"
            class="p-0.5"
          />
        </v-button>
      </span>
    </header>
    <v-field
      label="Name"
      class="col-span-6"
      :model-value="column.name"
      @update:modelValue="value => column = { ...column, name: value }"
    />
    <v-field
      class="col-span-6"
      input="suggest"
      label="Type"
      :model-value="column.type"
      :input-props="{
        options: ['INTEGER', 'TEXT', 'BLOB', 'REAL', 'NUMERIC']
      }"
      @update:modelValue="value => column = { ...column, type: value }"
    />
    <v-field
      label="Primary Key"
      :model-value="column.primaryKey"
      input="checkbox"
      :input-props="{
        text: 'Primary Key'
      }"
      class="col-span-2"
      @update:modelValue="value => column = { ...column, primaryKey: value }"
    />
    <v-field
      label="Not Null"
      :model-value="column.notNull"
      input="checkbox"
      :input-props="{
        text: 'Not Null'
      }"
      class="col-span-2"
      @update:modelValue="value => column = { ...column, notNull: value }"
    />
    <v-field
      label="Unqiue"
      :model-value="column.unique"
      input="checkbox"
      :input-props="{
        text: 'Unique'
      }"
      class="col-span-2"
      @update:modelValue="value => column = { ...column, unique: value }"
    />
    <v-field
      label="Min"
      class="col-span-3"
      input="number"
      :model-value="column.min"
      @update:modelValue="value => column = { ...column, min: value }"
    />
    <v-field
      label="Max"
      class="col-span-3"
      input="number"
      :model-value="column.max"
      @update:modelValue="value => column = { ...column, max: value }"
    />
    <v-field
      label="Default"
      class="col-span-6"
    >
      <v-group
        :model-value-mapping="['enabled', 'value']"
        :model-value="column.default"
        @update:modelValue="value => column = { ...column, default: value }"
      >
        <v-checkbox />
        <v-input />
      </v-group>
    </v-field>
    <v-field
      label="Foreign Key"
      class="col-span-6"
    >
      <v-group
        :model-value="column.foreign"
        :model-value-mapping="['table', 'column']"
        @update:modelValue="value => column = { ...column, foreign: value }"
      >
        <v-suggest :options="tableOptions" />
        <v-suggest
          :options="columnOptions"
          @focus="column.foreign.table && column.foreign.table in $store.state.tables && $store.dispatch('queryColumns', column.foreign.table)"
        />
      </v-group>
    </v-field>
  </main>
</template>

<script lang="ts">
import { VInput, VGroup, VCheckbox, VField, VButton, VSuggest } from '@/components/Core'
import type { Column } from '@/store/types'
import omit from 'lodash/omit'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { TrashIcon, TrashOffIcon } from 'vue-tabler-icons'

export default defineComponent({
  components: {
    VInput,
    VGroup,
    VCheckbox,
    VField,
    VButton,
    VSuggest,
    TrashOffIcon,
    TrashIcon
  },
  props: {
    columnName: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const column = computed<Column>({
      get () {
        return store.state.modifications[props.tableName]?.columns[props.columnName]
      },
      set (value) {
        store.commit('setModifiedColumn', {
          tableName: props.tableName,
          columnName: props.columnName,
          column: value
        })
      }
    })
    const modified = computed(() => store.getters.columnModifications(props.tableName, props.columnName))

    const status = computed(() => {
      if (column.value.new) {
        return 'new'
      } else if (column.value.drop) {
        return 'delete'
      } else if (modified.value) {
        return 'modified'
      } else return 'orignal'
    })

    const revert = () => {
      if (column.value.new) {
        store.commit('setModification', {
          tableName: props.tableName,
          modified: {
            ...store.state.modifications[props.tableName],
            columns: omit(store.state.modifications[props.tableName].columns, props.columnName)
          }
        })
      } else {
        store.dispatch('revertModifiedColumn', { columnName: props.columnName, tableName: props.tableName })
      }
    }

    // function chooseTable (foreignTable: string|null) {
    //   if (foreignTable === '') {
    //     foreignTable = null
    //   } else {
    //     store.dispatch('queryColumns', foreignTable)
    //   }
    //   column.value = { ...column.value, foreign: { ...column.value.foreign, table: foreignTable } }
    // }
    // function chooseColumn (foreignColumn: string|null) {
    //   if (foreignColumn === '') foreignColumn = null
    //   column.value = { ...column.value, foreign: { ...column.value.foreign, column: foreignColumn } }
    // }

    // watch(
    //   () => column.value?.foreign.table && store.state.tables[column.value.foreign.table],
    //   () => {
    //     const foreign = column.value?.foreign
    //     if (foreign?.table) {
    //       store.dispatch('queryColumns', foreign.table)
    //       if (!(foreign.column ?? '' in store.state.tables[foreign.table]?.columns)) {
    //         column.value = {
    //           ...column.value,
    //           foreign: { ...foreign, column: null }
    //         }
    //       }
    //     }
    //   }
    // )

    const tableOptions = computed(() => Object.keys(store.state.tables))

    const columnOptions = computed(() =>
      column.value?.foreign.table && store.state.tables[column.value.foreign.table]?.columns
        ? Object.keys(store.state.tables[column.value.foreign.table].columns)
        : []
    )

    return {
      modified,
      revert,
      status,
      column,
      tableOptions,
      columnOptions
    }
  }
})
</script>

<style lang="postcss" scoped>
.column-card {
  @apply m-3;
  @apply p-3;
  @apply bg-white;
  @apply shadow-lg;
  @apply rounded-xl;
  @apply grid grid-cols-6 lg:grid-cols-12 gap-3;
  @apply justify-start;

  &:focus {
    @apply ring-primary ring-opacity-50 ring-4;
  }

  & header {
    @apply w-full;
    @apply flex justify-between;
    @apply relative;
    @apply col-span-full;
    & .header-status { @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  }
    & .header-controlls { @apply flex gap-2; }
  }
}
  /* & .header-status {
    @apply col-span-2;
  } */

  /* & header {
    @apply relative;
    @apply flex justify-between items-center;

     & .status {
       @apply absolute;
       @apply top-1/2 left-1/2;
       @apply transform -translate-x-1/2 -translate-y-1/2;
     }
  } */

/* .column-card {
  @apply m-3;
  @apply bg-white;
  @apply p-3;
  @apply rounded-2xl;
  @apply shadow-lg;
}

.column-card main {
  @apply grid grid-cols-4 items-end;
}

.column-card header {
  @apply relative;
  @apply flex justify-between items-center;
  @apply mx-2;

  & .status {
    @apply absolute;
    @apply top-1/2 left-1/2;
    @apply transform -translate-x-1/2 -translate-y-1/2;
  }

  & .controlls {
    @apply flex;
    @apply gap-1;

    & fa-icon {
      @apply h-8 w-8;
      @apply rounded-md;

      &:hover {
        @apply bg-gray-200;
      }
    }
  }
}

.column-card label {
  @apply col-span-2;
  @apply m-2;

  &.half {
    @apply col-span-1 justify-self-start;
  }
} */
</style>
