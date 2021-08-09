<template>
  <teleport to="body">
    <transition-group
      id="message-manager"
      tag="div"
      name="message-manager"
    >
      <v-message
        v-for="message_attrs in message.messages"
        :key="message_attrs.id"
        v-bind="{ ...message_attrs, id: undefined }"
      />
    </transition-group>
  </teleport>
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
import { defineComponent, onBeforeUnmount, onMounted, provide, reactive } from 'vue'
import TheNavigation from './components/TheNavigation.vue'
import initSqlJs from 'sql.js'
import { useStore } from 'vuex'
import mean from 'lodash/mean'
import { VMessage } from '@/components/Core'

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

export interface MessageSystem {
  ref?: HTMLDivElement,
  messages: {
    body: string,
    status: 'primary' | 'success' | 'error' | 'warning',
    id?: number
  }[],
  primary(name: string): void,
  success(name: string): void
  error(name: string): void,
  warning(name: string): void,
  push(attrs: {
    body: string,
    status: 'primary' | 'success' | 'error' | 'warning'
  }): void
}

const asyncWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineComponent({
  components: {
    TheSide,
    TheNavigation,
    VMessage
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

    provide('loading', loading)

    const interval = setInterval(() => loading.increment(), 210)

    onBeforeUnmount(() => clearInterval(interval))

    // meessage manager
    const message = reactive<MessageSystem>({
      ref: undefined,
      messages: [],
      async push (attrs) {
        this.messages.push({
          ...attrs,
          id: (this.messages[this.messages.length - 1]?.id ?? -1) + 1
        })
        setTimeout(() => this.messages.shift(), 3000)
      },
      async primary (body) {
        this.push({
          body,
          status: 'primary'
        })
      },
      async success (body) {
        this.push({
          body,
          status: 'success'
        })
      },
      async error (body) {
        this.push({
          body,
          status: 'error'
        })
      },
      async warning (body) {
        this.push({
          body,
          status: 'error'
        })
      }
    })

    provide('message', message)

    onMounted(() => {
      window.$loading = loading
      window.$message = message
    })

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

    return { loading, message }
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
  @apply bg-primary;
  transition: max-width 200ms linear;

  &.error {
    @apply bg-red-500;
  }
}

#message-manager {
  @apply fixed;
  @apply bottom-4 right-4;
  @apply flex flex-col gap-2;
}

#message-manager {
  & .message-manager-enter-active,
  & .message-manager-leave-active {
    @apply transition-all;
    @apply duration-500;
    @apply ease-in-out;
  }
  & .message-manager-enter-from,
  & .message-manager-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}

/* .list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
} */
</style>
