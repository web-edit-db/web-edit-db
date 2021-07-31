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
      <button
        :disabled="!sqlJsReady"
        @click="openDatabase"
      >
        Open
      </button>
      <button
        :disabled="!sqlJsReady"
        @click="newDatabase"
      >
        New
      </button>
      <button
        :disabled="!databaseReady"
        @click="saveDatabase"
      >
        Save
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
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
  @apply border-b-2 border-primary-500;
  @apply shadow-lg;
  @apply flex justify-between items-center;
}

nav h1 {
  @apply flex items-center;
  @apply text-2xl;
  @apply text-primary-500;
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

nav .controlls button {
  @apply px-1 py-0.5;
  @apply rounded;

  &:hover {
    @apply bg-gray-300;

    &:disabled {
      @apply bg-transparent;
    }
  }

  &:disabled {
    @apply cursor-not-allowed;
    @apply opacity-50;
  }
}
</style>
