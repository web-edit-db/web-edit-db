<template>
  <div
    class="wrapper"
    @keyup.ctrl.enter.exact="changes.commit"
    @keyup.ctrl.esc.exact="changes.discard"
  >
    <div ref="columnCards">
      <header>
        <h1>
          {{ name }}
        </h1>
        <span>
          <v-button
            variant="primary"
            @click="renameTable"
          >
            <edit-icon />
            Rename table
          </v-button>
          <v-button
            variant="error"
            @click="deleteTable"
          >
            <trash-icon />
            {{ isNew ? 'Discard Table' : 'Delete table' }}
          </v-button>
        </span>
      </header>
      <column-card
        v-for="column, key in columns"
        :key="`Column ${key}`"
        :ref="el => columnRefs[key] = el?.$el"
        :column-name="key"
        :table-name="name"
        sortable
      />
      <footer>
        <v-button
          :text="isNew ? 'Create Table' : 'Commit Changes'"
          :disabled="!isModified"
          variant="success"
          @click="changes.commit"
        />
        <v-button
          text="Disscard Changes"
          :disabled="!isModified"
          variant="error"
          @click="changes.discard"
        />
        <i class="mx-auto" />
        <v-button
          text="Add column"
          variant="primary"
          @click="changes.addColumn"
        />
      </footer>
    </div>
    <nav ref="columnNav">
      <v-button
        v-for="column, key in columns"
        :key="`scroll-to-column-${key}`"
        :text="column.new ? column.name : key"
        sortable
        hollow
        @click="() => focusColumn(key)"
      />
      <v-button
        :disabled="!isModified"
        :text="isNew ? 'Create Table' : 'Commit Changes'"
        variant="success"
        @click="changes.commit"
      />
      <v-button
        text="Disscard Changes"
        :disabled="!isModified"
        variant="error"
        @click="changes.discard"
      />
    </nav>
  </div>
</template>

<script lang="ts">
import ColumnCard from '@/components/ColumnCard.vue'
import VButton from '@/components/Core/Button.vue'
import Sortable from '@shopify/draggable/lib/sortable'
import arrayMove from 'array-move'
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { EditIcon, TrashIcon } from 'vue-tabler-icons'
import invoke from 'lodash/invoke'
import debounce from 'lodash/debounce'
import { DialogSystem } from '@/App.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    ColumnCard,
    VButton,
    EditIcon,
    TrashIcon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()

    const dialog = inject<DialogSystem>('dialog')

    const columnRefs = ref<{[key: string]: HTMLDivElement | undefined}>({})

    const columnCards = ref<HTMLDivElement>()
    const columnNav = ref<HTMLDivElement>()

    const columns = computed({
      get: () => store.state.modifications[props.name]?.columns,
      set: (value) => store.commit('setModification', {
        tableName: props.name,
        modified: {
          ...store.state.modifications[props.name],
          columns: value
        }
      })
    })
    const isModified = computed(() => store.getters.tableModified(props.name))
    const isNew = computed(() => store.state.modifications[props.name]?.new)

    const changes = {
      commit () {
        if (isNew.value) {
          store.dispatch('createTable', { tableName: props.name })
        } else {
          store.dispatch('alterTable', { tableName: props.name })
        }
      },
      async discard () {
        await store.commit('setModification', {
          tableName: props.name,
          modified: {
            ...store.state.modifications[props.name],
            columns: store.state.tables[props.name]?.columns ?? {}
          }
        })
      },
      addColumn () {
        store.dispatch('addModifiedColumn', { tableName: props.name })
      }
    }

    const focusColumn = (columnName: string) => {
      invoke(columnRefs.value, [columnName, 'focus'], { preventScroll: true })
      invoke(columnRefs.value, [columnName, 'scrollIntoView'], { behavior: 'smooth', block: 'center' })
    }

    onMounted(() => {
      if (!isNew.value) store.dispatch('queryColumns', props.name)

      function sorted ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
        columns.value = Object.fromEntries(arrayMove(Object.entries(columns.value), oldIndex, newIndex))
      }
      const sortableColumns = new Sortable(
        columnCards.value as HTMLDivElement,
        {
          draggable: '[sortable]',
          distance: 15,
          mirror: { constrainDimensions: true }
        }
      )
      sortableColumns.on('sortable:sorted', sorted)
      sortableColumns.on('drag:start', (event) => {
        if ((event.originalEvent.target as HTMLElement).tagName === 'INPUT') event.cancel()
      })
      const sortableNav = new Sortable(
        columnNav.value as HTMLDivElement,
        {
          draggable: '[sortable]',
          distance: 15,
          mirror: { constrainDimensions: true, xAxis: false }
        }
      )
      sortableNav.on('sortable:sorted', ({ oldIndex, newIndex }) => {
        sorted({ oldIndex, newIndex })
        debounce(invoke, 500, { maxWait: 100 })(
          columnRefs.value, [Object.keys(columns.value)[newIndex], 'scrollIntoView'], { behavior: 'smooth', block: 'center' }
        )
      })
      sortableNav.on('sortable:stop', ({ newIndex }) => invoke(columnRefs.value, [Object.keys(columns.value)[newIndex], 'scrollIntoView'], { behavior: 'smooth', block: 'center' }))
    })

    function deleteTable () {
      if (dialog) {
        dialog.confirm(
          'Do you really want to delete?',
          {
            positive: 'Delete',
            positiveVariant: 'error',
            onPositive () {
              const tables = computed(() => store.getters.tableNames)
              if (tables.value.length > 1) {
                // there are other tables so push to next table
                // get the next table name
                const nextName = tables.value[
                  (tables.value.indexOf(props.name) + 1) % tables.value.length
                ]
                router.push(`/table/${nextName}`)
              } else router.push('/') // no tables so push /
              if (isNew.value) {
                store.commit(
                  'setModifications',
                  Object.fromEntries(
                    Object.entries(
                      store.state.modifications
                    ).filter(
                      obj => obj[0] !== props.name
                    )
                  )
                )
              } else {
                store.dispatch('dropTable', props.name)
              }
            }
          }
        )
      }
    }
    function renameTable () {
      if (dialog) {
        dialog.prompt(
          'Enter new name',
          {
            title: 'Rename table',
            initialPrompt: props.name,
            onPositive (newTableName: string) {
              store.dispatch(
                isNew.value ? 'renameModification' : 'renameTable',
                { tableName: props.name, newTableName }
              )
              router.replace({ params: { name: newTableName } })
            }
          }
        )
      }
    }

    return {
      isModified,
      isNew,
      columnCards,
      columnNav,
      changes,
      columns,
      focusColumn,
      columnRefs,
      deleteTable,
      renameTable
    }
  }
})
</script>

<style lang="postcss" scoped>
div.wrapper {
  @apply max-w-6xl;
  @apply mx-auto;
  @apply flex;
  @apply px-4;

  & > div {
    @apply w-full;
  }
}

nav {
  @apply flex flex-col;
  @apply p-3 pl-0;
  @apply gap-3;
  @apply sticky top-0;
  @apply self-start;

  & button {
    @apply w-36;
    @apply overflow-hidden;
    @apply block;
    @apply ellipsis;
    @apply text-left;
  }
}

footer {
  @apply m-3;
  @apply flex gap-2.5;
}

header {
  @apply flex justify-between items-center;
  @apply p-3;

  & h1 {
    @apply text-2xl;
    @apply overflow-hidden;
    @apply max-w-lg;
    @apply ellipsis;
  }

  & span {
    @apply flex gap-3;
  }
}
</style>
