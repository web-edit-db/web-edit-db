<template>
  <aside>
    <header>{{ database.name }}</header>
    <main></main>
    <footer>
      <span>Open Database</span>
    </footer>
  </aside>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      database: {
        name: 'Database Name'
      }
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
