<template>
  <div class="wrapper">
    <div ref="columnCards">
      <column-card
        v-for="key in order"
        :key="`Column ${key}`"
        :columnName="key"
        :tableName="name"
        :ref="el => columnRefs[key] = el?.$el"
        sortable
      />
      <footer>
        <form-button
          value="Commit Changes"
          color="green"
          @click="changes.commit"
          :disabled="!modified"
        />
        <form-button
          value="Disscard Changes"
          color="red"
          @click="changes.discard"
          :disabled="!modified"
        />
        <i class="mx-auto" />
        <form-button
          value="Add column"
          @click="changes.addColumn"
        />
      </footer>
    </div>
    <nav ref="columnNav">
      <form-button
        v-for="key in order"
        :key="`Button ${key}`"
        :value="columns[key].new ? columns[key].name : key"
        @click="() => focusColumn(key)"
        sortable
        color="white"
      />
      <form-button value="Apply Changes" class="commit" color="green" :disabled="!modified" @click="changes.commit" />
      <form-button value="Discard Changes" class="discard" color="red" :disabled="!modified" @click="changes.discard" />
    </nav>
  </div>
</template>

<script lang="ts">
import ColumnCard from '@/components/ColumnCard.vue'
import FormButton from '@/components/Form/Button.vue'
import store from '@/store'
import Sortable from '@shopify/draggable/lib/sortable'
import arrayMove from 'array-move'
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import invoke from 'lodash/invoke'
import debounce from 'lodash/debounce'

export default defineComponent({
  components: {
    ColumnCard,
    FormButton
  },
  props: ['name'],
  setup (props) {
    const store = useStore()

    const columnRefs = ref<{[key: string]: HTMLDivElement | undefined}>({})

    const columnCards = ref<HTMLDivElement>()
    const columnNav = ref<HTMLDivElement>()

    const order = computed<string[]>({
      get () { return store.state.modifications[props.name]?.order },
      set (value) {
        store.commit('setModification', {
          tableName: props.name,
          modified: {
            columns: store.state.modifications[props.name].columns,
            order: value
          }
        })
      }
    })
    const columns = computed(() => store.state.modifications[props.name].columns)
    const modified = computed(() => store.getters.tableModified(props.name))

    const changes = {
      commit () {
        store.dispatch('alterTable', { tableName: props.name })
      },
      async discard () {
        await store.commit('setModification', {
          tableName: props.name,
          modified: {
            columns: store.state.tables[props.name].columns,
            order: Object.keys(store.state.tables[props.name].columns)
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
      store.dispatch('queryColumns', props.name)

      function sorted ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
        order.value = arrayMove(order.value, oldIndex, newIndex)
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
          columnRefs.value, [order.value[newIndex], 'scrollIntoView'], { behavior: 'smooth', block: 'center' }
        )
      })
      sortableNav.on('sortable:stop', ({ newIndex }) => invoke(columnRefs.value, [order.value[newIndex], 'scrollIntoView'], { behavior: 'smooth', block: 'center' }))
    })

    return {
      order,
      modified,
      columnCards,
      columnNav,
      changes,
      columns,
      focusColumn,
      columnRefs
    }
  },
  beforeRouteEnter (to, _from, next) {
    if ((to.params.name as string) in store.state.tables) {
      next()
    } else {
      next('/')
    }
  }
})
</script>

<style lang="postcss" scoped>
div.wrapper {
  @apply max-w-6xl;
  @apply mx-auto;
  @apply flex;
}

nav {
  @apply flex flex-col;
  @apply p-3 pl-0;
  @apply gap-3;
  @apply sticky top-0;
  @apply self-start;

  & button {
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
      /* @apply bottom-12; */
    }

    &.discard {
      @apply bottom-3;
    }
  }
}

footer {
  @apply m-3;
  @apply flex gap-2.5;

  & > button {
    @apply shadow-md;
  }
}
</style>
