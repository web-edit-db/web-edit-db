<template>
  <aside>
    <header>{{ name }}</header>
    <main>
      <router-link v-for="table in tables" :key="table.name" :to="`/table/${table.name}`">
        <div>
          {{ table.name }}
        </div>
      </router-link>
      {{ version }}
    </main>
    <footer>
      <span @click="file.create">Create Database</span><br>
      <span @click="file.open">Open Database</span><br>
      <span @click="file.save" v-if="saveReady">Write Database</span><br>
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
    const { open, save, name, saveReady, tables, create, version } = useDatabase()

    return {
      file: {
        open,
        save,
        create
      },
      saveReady,
      name,
      tables,
      version
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
