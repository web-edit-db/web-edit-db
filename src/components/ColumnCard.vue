<template>
  <div>
    <header>
      <span class="name">{{ column.new ? column.name : columnName }}</span>
      <span :class="{
        'text-blue-500': status === 'modified',
        'text-green-700': status === 'orignal',
        'text-yellow-600': status === 'new',
        'text-red-600': status === 'delete',
        'status': true
      }">
        {{ status }}
      </span>
      <span class="controlls">
        <icon :icon="column.drop ? 'trash-restore' : 'trash'" @click="column.new ? revert() : column = {...column, drop: !column.drop}"/>
        <icon icon='undo-alt' @click="revert"/>
      </span>
    </header>
    <main>
      <form-input
        type="text"
        label="Name"
        :modelValue="column.name"
        @update:modelValue="value => column = {...column, name: value}"
        autocomplete="off"
      />
      <form-input
        type="text"
        label="Type"
        :modelValue="column.type"
        @update:modelValue="value => column = {...column, type: value}"
        autocomplete="off"
      />
      <form-input
        type="checkbox"
        label="Not Null"
        :modelValue="column.notNull"
        @update:modelValue="value => column = {...column, notNull: value}"
      />
      <form-input
        type="checkbox"
        label="Primary Key"
        :modelValue="column.primaryKey"
        @update:modelValue="value => column = {...column, primaryKey: value}"
      />
      <form-input
        type="checkbox"
        label="Unique"
        :modelValue="column.unique"
        @update:modelValue="value => column = {...column, unique: value}"
      />
      <form-input
        type="text"
        label="Default"
        :modelValue="column.default.value ?? ''"
        @update:modelValue="value => column = {...column, default: { value, enabled: column.default.enabled } }"
        autocomplete="off"
      />
      <form-input
        type="number"
        label="Min"
        :modelValue="column.min"
        @update:modelValue="value => column = {...column, min: value}"
        autocomplete="off"
        :extraClass="{ half: true }"
      />
      <form-input
        type="number"
        label="Max"
        :modelValue="column.max"
        @update:modelValue="value => column = {...column, max: value}"
        autocomplete="off"
        :extraClass="{ half: true }"
      />
    </main>
  </div>
</template>

<script lang="ts">
import FormInput from '@/components/Form/Input.vue'
import Icon from '@/components/Icon.vue'
import type { Column } from '@/store/types'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import omit from 'lodash/omit'

export default defineComponent({
  props: ['columnName', 'tableName'],
  components: {
    FormInput,
    Icon
  },
  setup (props) {
    // const { columnName, tableName } = toRefs(props)
    const store = useStore()
    const column = computed<Column>({
      get () {
        return store.state.modifications[props.tableName].columns[props.columnName]
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
            columns: omit(store.state.modifications[props.tableName].columns, props.columnName),
            order: store.state.modifications[props.tableName].order.filter((key: string) => key !== props.columnName)
          }
        })
      } else {
        store.commit('setModifiedColumn', {
          columnName: props.columnName,
          tableName: props.tableName,
          column: store.state.tables[props.tableName].columns[props.columnName]
        })
      }
    }

    return {
      modified,
      revert,
      status,
      column
    }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply m-3;
  @apply bg-white;
  @apply p-3;
  @apply rounded-2xl;
  @apply shadow-lg;
}

div main {
  @apply grid grid-cols-4 items-end;
}

div main label:not(.half):not(.checkbox) {
  @apply col-span-2;
}

div header {
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
</style>
