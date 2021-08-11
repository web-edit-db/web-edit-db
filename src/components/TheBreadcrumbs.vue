<template>
  <div>
    <template v-if="databaseName">
      <v-button
        variant="text"
        size="sm"
        :text="databaseName"
        @click="renameDatabase"
      />
      <separator />
    </template>
    <v-button
      variant="text"
      size="sm"
      :text="$route.name"
    />
    <template v-if="$route.name === 'Table'">
      <separator />
      <v-button
        variant="text"
        size="sm"
        :text="$route.params.name"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, h, inject } from 'vue'
import { useStore } from 'vuex'
import {
  VLabel,
  VButton
} from '@/components/Core'
import { DialogSystem } from '@/App.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  components: {
    separator: () => h('span', { class: 'text-2xl text-primary' }, '/'),
    VLabel,
    VButton
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const dialog = inject<DialogSystem>('dialog')

    const databaseName = computed(() => store.state.database?.name)
    function renameDatabase () {
      if (dialog) {
        dialog.prompt('', {
          title: 'Rename database',
          initialPrompt: store.state.database.name,
          onPositive: (name: string) => {
            store.commit(
              'setDatabase',
              {
                ...store.state.database,
                name
              }
            )
            // replace with current path so title updates
            router.replace(route.path)
          }
        })
      }
    }

    return {
      databaseName,
      renameDatabase
    }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply flex items-center gap-2;
}
</style>
