<template>
  <div class="wrapper">
    <div ref="columnCards">
      <column-card
        v-for="key in order"
        :key="columns[key].name"
        :column="columns[key]"
        :ref="el => el && (refs[key] = el)"
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
      </footer>
    </div>
    <nav ref="columnNav">
      <form-button v-for="key in order" :key="columns[key].name" :value="columns[key].name" color="white" @click="() => scrollToColumn(columns[key].name)" sortable/>
      <form-button value="Apply Changes" color="green" :disabled="!isModified" @click="changes.commit" />
      <form-button value="Discard Changes" color="red" :disabled="!isModified" @apply="changes.discard" />
    </nav>
  </div>
</template>

<script lang="ts">
import { Column, useColumn, useTables } from '@/database'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import ColumnCard from '@/components/ColumnCard.vue'
import FormButton from '@/components/Form/Button.vue'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
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
    const newColumns = ref<Column[]>([])
    const columns = computed(() => list(props.name))
    const columnsInOrder = computed(() =>
      order.value.map(key => columns.value[key])
    )

    const modified = computed(() =>
      order.value.map(key => refs.value[key]?.modified)
    )
    const isModified = computed(
      () =>
        !isEqual(
          modified.value.map(column => omit(column, 'origName')),
          columns.value
        )
    )

    watch(
      () => columns.value,
      () => (order.value = Array.from(columns.value.keys())),
      { immediate: true }
    )

    const changes = {
      commit () {
        return update(props.name, modified.value)
      },
      discard () {
        // revert each column
        refs.value.forEach(column => column.revert())
        // clear new columns
        newColumns.value = []
        // reset order
        order.value = Array.from(columns.value.keys())
      }
    }

    function scrollToColumn (name: string) {
      const column = refs.value.find(column => column.column.name === name)
      if (column) { column.$el.scrollIntoView({ block: 'center' }) }
    }

    onMounted(() => {
      const sortable = new Sortable(
        [columnCards.value as HTMLDivElement, columnNav.value as HTMLDivElement],
        {
          draggable: '[sortable]',
          distance: 15,
          mirror: {
            constrainDimensions: true
          }
        }
      )
      sortable.on('sortable:sorted', ({ oldIndex, newIndex }) => {
        order.value = arrayMove(order.value, oldIndex, newIndex)
      })
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
      scrollToColumn
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
