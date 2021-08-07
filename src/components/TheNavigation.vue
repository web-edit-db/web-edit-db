<template>
  <nav>
    <router-link
      v-slot="{ navigate }"
      to="/"
      custom
    >
      <h1 @click="navigate">
        <img src="@/assets/logo.png">
        <span>Web Edit DB</span>
      </h1>
    </router-link>
    <div>database name / home</div>
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
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import VButton from '@/components/Core/Button.vue'
import { DatabaseImportIcon, DatabaseIcon, DatabaseExportIcon } from 'vue-tabler-icons'

export default defineComponent({
  components: { VButton, DatabaseImportIcon, DatabaseIcon, DatabaseExportIcon },
  setup () {
    const store = useStore()
    const sqlJsReady = computed(() => !!store.state.sqlJs)
    const databaseReady = computed(() => !!store.state.sqlJs && !!store.state.database)

    const openDatabase = () => store.dispatch('open')
    const newDatabase = () => store.dispatch('create')
    const saveDatabase = () => store.dispatch('save')

    return { sqlJsReady, databaseReady, openDatabase, newDatabase, saveDatabase }
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
