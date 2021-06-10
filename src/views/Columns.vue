<template>
  <div class="wrapper">
    <div ref="columnCards">
      <column-card
        v-for="key in order"
        :key="`Column ${columns[key].name}`"
        :column="columns[key]"
        :ref="el => el && (refs[key] = el)"
        @revert="(modified) => modified.value.new && deleteAdded(key)"
        sortable
      />
      <footer>
        <form-button
          value="Commit Changes"
          color="green"
          @click="changes.commit"
          :disabled="!isModified"
        />
        <form-button
          value="Disscard Changes"
          color="red"
          @click="changes.discard"
          :disabled="!isModified"
        />
        <i class="mx-auto" />
        <form-button
          value="Add column"
          @click="addColumn"
        />
      </footer>
    </div>
    <nav ref="columnNav">
      <form-button
        v-for="key in order"
        :key="`Button ${columns[key].name}`"
        :value="refs[key]?.modified.new ? refs[key]?.modified.name : columns[key].name"
        @click="() => scrollToColumn(columns[key].name)"
        sortable
        color="white"
      />
      <form-button value="Apply Changes" class="commit" color="green" :disabled="!isModified" @click="changes.commit" />
      <form-button value="Discard Changes" class="discard" color="red" :disabled="!isModified" @click="changes.discard" />
    </nav>
  </div>
</template>

<script lang="ts">
import { Column, useColumn, useTables } from '@/database'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import ColumnCard from '@/components/ColumnCard.vue'
import FormButton from '@/components/Form/Button.vue'
import arrayMove from 'array-move'
import Sortable from '@shopify/draggable/lib/sortable'

export default defineComponent({
  components: {
    ColumnCard,
    FormButton
  },
  props: ['name'],
  setup (props) {
    const { list } = useColumn()
    const { update } = useTables()

    const columnCards = ref<HTMLDivElement>()
    const columnNav = ref<HTMLDivElement>()

    const order = ref<number[]>([])
    const refs = ref<typeof ColumnCard[]>([])
    const addedColumns = ref<Partial<Column>[]>([])
    const columns = computed(() => [...list(props.name), ...addedColumns.value])
    const columnsInOrder = computed(() =>
      order.value.map(key => columns.value[key])
    )

    const modified = computed(() =>
      order.value.map(key => refs.value[key]?.modified)
    )
    const isModified = computed(() => refs.value.some((column) => column.status !== 'orignal'))

    watch(
      () => list(props.name),
      () => (order.value = Array.from(columns.value.keys())),
      { immediate: true }
    )

    const changes = {
      commit () {
        update(props.name, modified.value)
        nextTick(() => changes.discard())
      },
      discard () {
        // clear new columns
        addedColumns.value = []
        // revert each column
        refs.value.forEach(column => column.revert())
        // reset order
        order.value = Array.from(columns.value.keys())
      }
    }

    function scrollToColumn (name: string) {
      const column = refs.value.find(column => column.column.name === name)
      if (column) { column.$el.scrollIntoView({ block: 'center' }) }
    }

    function addColumn () {
      let columnNumber = 0
      do { columnNumber++ } while (refs.value.find(ref => ref.modified.name === `Column${columnNumber}`))
      addedColumns.value.push({
        name: `Column${columnNumber}`,
        type: 'INTEGER',
        min: null,
        max: null,
        notNull: false,
        primaryKey: false,
        unique: false,
        defaultValue: undefined,
        foreign: undefined,
        new: true
      })
      order.value.push(order.value.length)
    }

    function deleteAdded (key:number) {
      // find the index of the added column
      const addedColumnIndex = [
        ...list(props.name).keys(),
        ...addedColumns.value.keys()
      ][key]
      // get the index of the column key within the order array
      const orderIndex = order.value.indexOf(key)

      addedColumns.value = [
        ...addedColumns.value.slice(0, addedColumnIndex),
        ...addedColumns.value.slice(addedColumnIndex + 1, addedColumns.value.length)
      ]
      order.value = [
        ...order.value.slice(0, orderIndex),
        ...order.value.slice(orderIndex + 1, order.value.length)
      ].map(value => value - +(value > key))
    }

    onMounted(() => {
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
      sortableNav.on('sortable:sorted', sorted)
    })

    return {
      columns,
      columnsInOrder,
      order,
      refs,
      modified,
      isModified,
      changes,
      columnCards,
      columnNav,
      scrollToColumn,
      addedColumns,
      addColumn,
      deleteAdded
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
