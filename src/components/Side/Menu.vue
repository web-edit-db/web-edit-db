<template>
  <aside :class="{ open: menuOpen }">
    <header>
      <h3>{{ name || "Open A Database" }}</h3>
      <icon icon="chevron-left" size="lg" @click="menuOpen = !menuOpen"/>
    </header>
    <main v-if="menuOpen">
      <side-tables />
    </main>
    <footer v-if="menuOpen">
      <icon icon="file-upload" size="lg" @click="open" title="open database" />
      <icon icon="file" size="lg" @click="create" title="create database" />
      <icon
        icon="save"
        size="lg"
        @click="loaded && save()"
        title="save database"
        :wrapper="{ disabled: loaded, class: { 'opacity-30': !loaded } }"
      />
    </footer>
  </aside>
</template>

<script lang="ts">
import Icon from '@/components/Icon.vue'
import SideTables from '@/components/Side/Tables.vue'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  components: { Icon, SideTables },
  setup () {
    const store = useStore()
    const router = useRouter()

    const menuOpen = ref(true)

    const name = computed(() => store.state.name)
    const loaded = computed(() => !!store.state.database)

    const open = async () => {
      await store.dispatch('open')
      await store.dispatch('queryTables')
    }
    const create = async () => {
      await store.dispatch('create')
      await store.dispatch('queryTables')
      await router.push('/')
    }
    const save = () => store.dispatch('save')

    return { name, loaded, open, create, save, menuOpen }
  }
})
</script>

<style lang="postcss" scoped>
aside {
  @apply flex flex-col;
  @apply w-60;
  @apply rounded-r-3xl;
  @apply bg-white;
  @apply shadow-lg;
}

header {
  @apply flex justify-between items-center;
  @apply p-3;

  & h3 {
    @apply text-xl;
    @apply leading-none;
    @apply font-extrabold;
    @apply select-none;
  }

  & fa-icon {
    @apply h-8 w-8;
    @apply rounded;

    &:hover {
      @apply bg-gray-200;
    }
  }
}

main {
  @apply flex-grow;
  @apply overflow-y-auto;
}

footer {
  @apply flex justify-between;
  @apply px-3 py-2;

  & fa-icon {
    @apply h-8 w-8;
    @apply rounded;

    &:hover {
      @apply bg-gray-200;
    }
  }
}
</style>
