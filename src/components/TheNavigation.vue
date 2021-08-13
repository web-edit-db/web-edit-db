<template>
  <nav>
    <router-link
      v-slot="{ navigate }"
      to="/"
      custom
    >
      <h1 @click="navigate">
        <img
          src="@/assets/logo.png"
          class="p-1.5"
        >
        <span>Web Edit DB</span>
      </h1>
    </router-link>
    <the-breadcrumbs />
    <div class="controlls">
      <v-button
        :disabled="!sqlJsReady"
        variant="warning"
        hollow
        @click="newDatabase"
      >
        <database-icon class="p-0.5" />
        <span>
          New
        </span>
      </v-button>
      <v-button
        :disabled="!sqlJsReady"
        variant="warning"
        hollow
        @click="openDatabase"
      >
        <database-import-icon class="p-0.5" />
        <span>
          Open
        </span>
      </v-button>
      <v-button
        :disabled="!databaseReady"
        variant="primary"
        @click="saveDatabase"
      >
        <database-export-icon class="p-0.5" />
        <span>
          save
        </span>
      </v-button>
      <v-button
        variant="text"
        @click="showInfo"
      >
        <info-circle-icon />
      </v-button>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useStore } from 'vuex'
import VButton from '@/components/Core/Button.vue'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import { DatabaseImportIcon, DatabaseIcon, DatabaseExportIcon, InfoCircleIcon } from 'vue-tabler-icons'
import { DialogSystem } from '@/App.vue'
import { State } from '@/store/types'

export default defineComponent({
  components: {
    VButton,
    DatabaseImportIcon,
    DatabaseIcon,
    DatabaseExportIcon,
    InfoCircleIcon,
    TheBreadcrumbs
  },
  setup () {
    const store = useStore<State>()
    const dialog = inject<DialogSystem>('dialog')
    const sqlJsReady = computed(() => !!store.state.sqlJs)
    const databaseReady = computed(() => !!store.state.sqlJs && !!store.state.database)

    const openDatabase = () => store.dispatch('openDatabase')
    const newDatabase = () => store.dispatch('createDatabase')
    const saveDatabase = () => store.dispatch('saveDatabase')

    function showInfo () {
      if (dialog && store.state.sqlJs) {
        const version = new store.state.sqlJs.Database().exec('SELECT sqlite_version()')[0].values[0][0]
        dialog.success(`SQLite version v${version}`, {
          header: 'SQLite Version'
        })
      }
    }

    return { sqlJsReady, databaseReady, openDatabase, newDatabase, saveDatabase, showInfo }
  }
})
</script>

<style scoped lang="postcss">
nav {
  @apply bg-white;
  @apply h-14 px-3;
  @apply border-b-2 border-primary;
  @apply shadow-lg;
  @apply flex justify-between items-center;
}

nav h1 {
  @apply flex items-center;
  @apply text-2xl;
  @apply text-primary;
  @apply font-light;
  @apply select-none;
  @apply cursor-pointer;

  & img {
    @apply h-14;
  }
}

nav .controlls {
  @apply flex gap-3;
}
</style>
