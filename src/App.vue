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
  <teleport to="body">
    <div id="dialog-manager">
      <v-dialog
        v-for="dialog_attrs, i in dialog.dialogs"
        v-show="i === dialog.dialogs.length - 1"
        :key="dialog_attrs.id"
        v-bind="{
          ...dialog_attrs,
          id: undefined,
          body: typeof dialog_attrs.body === 'function' ? undefined : dialog_attrs.body
        }"
        :mask="true"
      >
        <template
          v-if="typeof dialog_attrs.body === 'function'"
          #body
        >
          <component :is="dialog_attrs.body" />
        </template>
      </v-dialog>
    </div>
  </teleport>
</template>

<script lang="ts">
import TheSide from '@/components/TheSide.vue'
import { defineComponent, ExtractPropTypes, onBeforeUnmount, onMounted, provide, reactive, VNode } from 'vue'
import TheNavigation from './components/TheNavigation.vue'
import initSqlJs from 'sql.js'
import { useStore } from 'vuex'
import mean from 'lodash/mean'
import { VMessage, VDialog } from '@/components/Core'
import { State } from './store/types'

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
  }): void,
  remove(id: number): void
}

export interface DialogSystem {
  dialogs: {
    id: number,
    mode?: string,
    header?: string|(() => VNode),
    body: string|(() => VNode),
    negative?: string,
    positive?: string,
    onFinish?: () => void,
    onPositive?: () => void,
    onNegative?: () => void
  }[],
  remove(id: number): void
  confirm(
    body: string|(() => VNode),
    attrs: ExtractPropTypes<typeof VDialog.props>
  ): void,
  success(
    body: string|(() => VNode),
    attrs: ExtractPropTypes<typeof VDialog.props>
  ): void,
  error(
    body: string|(() => VNode),
    attrs: ExtractPropTypes<typeof VDialog.props>
  ): void,
  prompt(
    body: string,
    attrs: ExtractPropTypes<typeof VDialog.props>
  ): void
}

const asyncWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default defineComponent({
  components: {
    TheSide,
    TheNavigation,
    VMessage,
    VDialog
  },
  setup () {
    const store = useStore<State>()

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

    // message manager
    const message = reactive<MessageSystem>({
      ref: undefined,
      messages: [],
      async remove (id) {
        this.messages = this.messages.filter((message) => message.id !== id)
      },
      async push (attrs) {
        const id = (this.messages[this.messages.length - 1]?.id ?? -1) + 1
        this.messages.push({
          ...attrs,
          id
        })
        setTimeout(() => this.remove(id), 3000)
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

    // dialog manager
    const dialog = reactive<DialogSystem>({
      dialogs: [],
      remove (id: number) {
        this.dialogs = this.dialogs.filter(dialog => dialog.id !== id)
      },
      async confirm (body, attrs) {
        const id = (this.dialogs[this.dialogs.length - 1]?.id ?? -1) + 1
        this.dialogs.push({
          id,
          body,
          ...attrs,
          mode: 'confirm',
          onFinish: () => this.remove(id)
        })
      },
      async success (body, attrs) {
        const id = (this.dialogs[this.dialogs.length - 1]?.id ?? -1) + 1
        this.dialogs.push({
          id,
          body,
          ...attrs,
          mode: 'success',
          onFinish: () => this.remove(id)
        })
      },
      async error (body, attrs) {
        const id = (this.dialogs[this.dialogs.length - 1]?.id ?? -1) + 1
        this.dialogs.push({
          id,
          body,
          ...attrs,
          mode: 'error',
          onFinish: () => this.remove(id)
        })
      },
      async prompt (body, attrs) {
        const id = (this.dialogs[this.dialogs.length - 1]?.id ?? -1) + 1
        this.dialogs.push({
          id,
          body,
          ...attrs,
          mode: 'prompt',
          onFinish: () => this.remove(id)
        })
      }
    })

    provide('dialog', dialog)

    onMounted(() => {
      window.$loading = loading
      window.$message = message
      window.$dialog = dialog
    })

    loading.start('sql.js')
    initSqlJs({ locateFile: (url) => `/assets/${url}` })
      .then((sqlJs) => {
        const preserved: (Pick<State, 'modifications'> & { database: { name: string, connection: string }}) | null = JSON.parse(sessionStorage.getItem('vuex-tab-preserve') ?? 'null')
        if (preserved) {
          store.replaceState({
            ...store.state,
            ...preserved,
            database: {
              ...preserved.database,
              connection: new sqlJs.Database(Uint8Array.from(preserved.database.connection.split(',') as unknown as number[])) // convert database back
            }
          })
        }
        store.commit('setSqlJs', sqlJs)
        store.dispatch('queryTables')
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

    return { loading, message, dialog }
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

#dialog-manager > div {
  @apply absolute;
  @apply top-0;
  @apply left-0;
  @apply z-40;
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
