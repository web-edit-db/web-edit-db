<template>
  <div
    class="wrapper"
    @keyup.ctrl.enter.exact="changes.commit"
    @keyup.ctrl.esc.exact="changes.discard"
  >
    <div ref="columnCards">
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
import store from '@/store'
import Sortable from '@shopify/draggable/lib/sortable'
import arrayMove from 'array-move'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import invoke from 'lodash/invoke'
import debounce from 'lodash/debounce'

export default defineComponent({
  components: {
    ColumnCard,
    VButton
  },
  beforeRouteEnter (to, _from, next) {
    if ((to.params.name as string) in store.state.modifications) {
      next()
    } else {
      next('/')
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()

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

    return {
      isModified,
      isNew,
      columnCards,
      columnNav,
      changes,
      columns,
      focusColumn,
      columnRefs
    }
  }
})
</script>

<style lang="postcss" scoped>
div.wrapper {
  @apply max-w-6xl;
  @apply mx-auto;
  @apply flex;

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

  /* & button {
    @apply shadow-inner-md;
    @apply px-3 py-2 ml-0;
    @apply leading-tight;
    @apply w-36;
    @apply text-left;
    @apply select-none;
    @apply text-sm;

    &.commit, &.discard {
      @apply sticky;
    }

    &.commit {
      @apply bottom-15;
    }

    &.discard {
      @apply bottom-3;
    }
  } */
}

footer {
  @apply m-3;
  @apply flex gap-2.5;
}
</style>
