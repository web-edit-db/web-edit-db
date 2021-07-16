<template>
  <the-navigation />
  <the-side />
  <main>
    <router-view
      :key="$route.path"
    />
  </main>
</template>

<script lang="ts">
import TheSide from '@/components/TheSide.vue'
import { defineComponent } from 'vue'
import TheNavigation from './components/TheNavigation.vue'
import initSqlJs from 'sql.js'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    TheSide,
    TheNavigation
  },
  setup () {
    const store = useStore()
    initSqlJs({ locateFile: (url) => `/assets/${url}` })
      .then((sqlJs) => {
        store.commit('setSqlJs', sqlJs)
      })
      .catch((error) => {
        console.error(
          `Falied to load the database engine.
          Please refresh the page.`
        )
        console.error(error)
      })

    return {}
  }
})
</script>

<style lang="postcss">
#app {
  @apply bg-gray-100;
  @apply h-screen;
  @apply grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}

#app > nav {
  grid-column: span 2;
}

#app > main {
  @apply overflow-y-auto;
}
</style>
