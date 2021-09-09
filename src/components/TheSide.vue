<template>
  <aside :class="{ closed: !open }">
    <main>
      <header>
        <span>
          Tables
        </span>
        <v-button
          :disabled="!$store.state.database"
          variant="text"
          size="sm"
          @click="() => $store.dispatch('createModification').then(name => $router.push(`/table/${name}`))"
        >
          <plus-icon />
        </v-button>
      </header>
      <router-link
        v-for="table, tableName in tables"
        :key="tableName"
        v-slot="props"
        :to="{ name: 'Table', params: { name: tableName } }"
      >
        <span class="overflow-hidden ellipsis block">
          {{ tableName }} <span v-if="table?.new">(not real)</span>
        </span>
        <v-group
          v-if="props.isActive"
          class="ml-4 mt-2"
          variant="primary"
          size="sm"
          :vertical="true"
        >
          <!-- size="sm" -->
          <v-button
            style="justify-content: space-between;"
            tag="router-link"
            :to="{ name: 'TableColumns' }"
          >
            <span>Columns</span>
            <layout-columns-icon />
          </v-button>
          <v-button
            v-if="!table?.new"
            style="justify-content: space-between;"
            tag="router-link"
            :to="{ name: 'TableData' }"
          >
            <span>Data</span>
            <layout-rows-icon />
          </v-button>
        </v-group>
      </router-link>
    </main>
    <div
      :class="{ toggle: true, open: !open }"
      @click="open = (!open)"
    />
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { VButton, VGroup } from '@/components/Core'
import { PlusIcon, LayoutColumnsIcon, LayoutRowsIcon } from 'vue-tabler-icons'
import { State } from '@/store/types'

export default defineComponent({
  components: {
    VButton,
    VGroup,
    PlusIcon,
    LayoutColumnsIcon,
    LayoutRowsIcon
  },
  setup () {
    const store = useStore<State>()

    // all the current tables
    const tables = computed(() => store.state.modifications)

    // controlls for the side
    const open = ref(true)

    return { open, tables }
  }
})
</script>

<style scoped lang="postcss">
aside {
  @apply relative;
  @apply w-56;
  @apply border-r-2 border-primary;

  @apply bg-white;
  @apply shadow-lg;

  @apply ease-in-out;
  @apply duration-300;
  transition-property: margin;

  &.closed {
    @apply -ml-56;
  }
}

aside .toggle {
  @apply absolute -right-7 top-1/2;
  @apply transform -translate-y-1/2;
  @apply w-6;
  @apply flex flex-col items-center;
  @apply cursor-pointer;
  @apply z-20;

  &::before, &::after {
    content: '';
    @apply block;
    @apply h-12 w-2;
    @apply bg-primary;
    @apply shadow-lg;
    @apply rounded-full;
    @apply transform;
    @apply transition-transform;
  }

  &::after {
    @apply -mt-1.5;
  }

  &:hover::before, &.open:hover::after {
    @apply rotate-12;
  }

  &:hover::after, &.open:hover::before {
    @apply -rotate-12;
  }
}

aside main {
  @apply flex flex-col;
  @apply p-3 gap-2;
  max-height: calc(100vh - theme('spacing.14'));
  @apply overflow-y-auto;

  & header {
    @apply font-medium;
    @apply text-lg;
    @apply flex justify-between items-center;
  }

  & a {
    @apply px-3 py-2;
    @apply rounded-lg;
    @apply bg-gray-100;
    @apply text-lg;

    & button {
      @apply justify-start;
    }
  }

  & a.router-link-active {
    @apply bg-primary;
    @apply text-white;
  }
}
</style>
