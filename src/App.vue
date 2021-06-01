<template>
  <aside>
    <header>{{ name }}</header>
    <main>
    </main>
    <footer>
      <icon icon='file-upload' size='lg' @click="open" title="open database" />
      <icon icon='file' size='lg' @click="create" />
      <icon icon='save' size='lg' @click='loaded && save' :wrapper="{disabled: loaded, class: {'opacity-30': !loaded}}" />
    </footer>
  </aside>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDatabase } from '@/database'
import Icon from './components/Icon.vue'

export default defineComponent({
  components: { Icon },
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
  @apply rounded-r-3xl;
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

#app > aside footer fa-icon {
  @apply h-12 w-12 inline-flex;
}
</style>
