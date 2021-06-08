<template>
  <side-menu />
  <main>
    <router-view :key="$route.path"/>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDatabase } from '@/database'
// import Icon from './components/Icon.vue'
// import TableMenu from './components/aside/TableMenu.vue'
import SideMenu from '@/components/Side/Menu.vue'
import { supported } from 'browser-fs-access'

export default defineComponent({
  components: {
    SideMenu
  },
  setup () {
    const { open, save, name, create, loaded } = useDatabase()

    return {
      open,
      save,
      create,
      name,
      loaded,
      supported
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

#app > main {
  @apply overflow-y-auto;
  @apply flex-grow;
}
</style>
