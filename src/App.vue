<template>
  <the-navigation />
  <the-side />
  <main>
    <router-view
      :key="$route.path"
    />
  </main>
  <div
    id="loading-bar"
    :ref="el => loading.ref = el"
    :style="{
      maxWidth: `${loading.percentage}%`,
    }"
  />
</template>

<script lang="ts">
import TheSide from '@/components/TheSide.vue'
import { defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue'
import TheNavigation from './components/TheNavigation.vue'
import initSqlJs from 'sql.js'
import { useStore } from 'vuex'
import mean from 'lodash/mean'

export interface LoadingSystem {
  ref?: HTMLDivElement
  percentages: {
    [key: string]: {limit: number, current: number}
  }
  percentage: number,
  start(name: string, position?: { limit?: number, current?: number }): void,
  finish(name: string): void,
  error(name: string): void,
  increment(): void
}

const asyncWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineComponent({
  components: {
    TheSide,
    TheNavigation
  },
  setup () {
    const store = useStore()

    // loading bar manager
    const loading = reactive<LoadingSystem>({
      ref: undefined,
      percentages: {},
      async start (name, { limit, current } = {}) {
        this.percentages[name] = {
          limit: limit || 80,
          current: current || 0
        }
      },
      async finish (name) {
        if (!(name in this.percentages)) {
          await this.start(name)
        }
        // if is the last remaning item
        if (this.ref && Object.values(this.percentages).length === 1) {
          // complete animation
          this.percentages[name].current = 100
          await asyncWait(400)
          // delete the element avoiding transition back to zero
          this.ref.style.transition = 'none'
          delete this.percentages[name]
          await asyncWait(40)
          // re-enable transitions
          this.ref.style.transition = ''
        } else {
          // just delete it
          delete this.percentages[name]
        }
      },
      async error (name) {
        if (this.ref) {
          if (this.percentages[name].current < 20) await asyncWait(1000)
          this.ref.classList.add('error')
          await this.finish(name)
          this.ref.classList.remove('error')
        }
      },
      get percentage (): number {
        return mean(Object.values(this.percentages).map(part => part.current)) || 0
      },
      increment () {
        for (const key in this.percentages) {
          const percentage = this.percentages[key]
          if (percentage.current < percentage.limit) percentage.current++
        }
      }
    })

    const interval = setInterval(() => loading.increment(), 210)

    onBeforeUnmount(() => clearInterval(interval))
    onMounted(() => (window.$loading = loading))

    loading.start('sql.js')
    initSqlJs({ locateFile: (url) => `/assets/${url}` })
      .then((sqlJs) => {
        store.commit('setSqlJs', sqlJs)
        loading.finish('sql.js')
      })
      .catch((error) => {
        loading.error('sql.js')
        console.error(
          `Falied to load the database engine.
          Please refresh the page.`
        )
        console.error(error)
      })

    return { loading }
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

#app > #loading-bar {
  @apply absolute top-0 left-0;
  @apply z-20;
  @apply h-0.5;
  @apply w-full;
  @apply max-w-0;
  @apply bg-purple-600;
  transition: max-width 200ms linear;

  &.error {
    @apply bg-red-500;
  }
}
</style>
