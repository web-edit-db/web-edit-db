<template>
  <aside>
    <header>{{ name }}</header>
    <main>
    </main>
    <footer>
      <span @click="create">Create Database</span><br>
      <span @click="open">Open Database</span><br>
      <span @click="save" v-if="loaded">Write Database</span><br>
    </footer>
  </aside>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDatabase } from '@/database'

export default defineComponent({
  components: { },
  setup () {
    const { open, save, name, create, loaded } = useDatabase()

    return {
      open,
      save,
      create,
      name,
      loaded
    }
  }
})
</script>

<style lang="postcss">
#app {
  @apply h-screen;
  @apply flex;
  @apply bg-gray-100;
}

#app > aside {
  @apply w-60;
  @apply bg-white;
  @apply rounded-3xl;
  @apply shadow-md;
  @apply flex flex-col;
}

#app > aside header {
  @apply p-4;
  @apply text-xl;
  @apply font-extrabold;
}

#app > aside main {
  @apply flex-grow;
}
</style>
