<template>
  <side-menu />
  <main>
    <router-view :key="$route.path"/>
  </main>
</template>

<script>
import SideMenu from '@/components/Side/Menu.vue'

export default {
  components: {
    SideMenu
  }
}
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
  scroll-behavior: smooth;
}
</style>
