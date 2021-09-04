<template>
  <div class="breadcrumbs z-30">
    <template v-if="databaseName">
      <v-button
        variant="text"
        size="sm"
        :text="databaseName"
        @click="renameDatabase"
      />
      <separator />
    </template>
    <v-dropdown
      :hidden-wrapper-attrs="{
        class: 'min-w-full'
      }"
    >
      <v-button
        variant="text"
        class="items-center"
        size="sm"
        :text="$route.name?.startsWith('Table') ? `Table - ${$route.params.name}` : $route.name"
      />
      <template #hidden>
        <v-group :vertical="true">
          <v-button
            tag="router-link"
            text="Home"
            to="/"
          />
          <v-dropdown
            trigger="hover"
            :hidden-wrapper-attrs="{
              style: 'left: 100%; top: 0;',
              class: 'max-h-40 overflow-y-auto overflow-x-hidden'
            }"
          >
            <v-button
              text="Table"
              class="w-full rounded-t-none"
              style="justify-content: start;"
            />
            <template #hidden>
              <v-group
                :vertical="true"
              >
                <v-button
                  v-for="table in tableNames"
                  :key="table"
                  tag="router-link"
                  :text="table"
                  :to="{ name: 'Table', params: { name: table } }"
                />
              </v-group>
            </template>
          </v-dropdown>
        </v-group>
      </template>
    </v-dropdown>
    <template v-if="$route.name?.startsWith('Table')">
      <separator />
      <div>
        <v-dropdown>
          <v-button
            variant="text"
            size="sm"
            :text="$route.name.substring(5)"
            class="table-name"
          />
          <template
            #hidden
          >
            <v-group
              :vertical="true"
            >
              <v-button
                tag="router-link"
                size="sm"
                text="Columns"
                :to="{
                  name: 'TableColumns'
                }"
              />
              <v-button
                v-if="!$store.state.modifications[$route.params?.name]?.new"
                tag="router-link"
                size="sm"
                text="Data"
                :to="{
                  name: 'TableData'
                }"
              />
            </v-group>
          </template>
        </v-dropdown>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, h, inject } from 'vue'
import { useStore } from 'vuex'
import {
  VButton,
  VDropdown,
  VGroup
} from '@/components/Core'
import { DialogSystem } from '@/App.vue'
import { useRoute, useRouter } from 'vue-router'
import { State } from '@/store/types'

export default defineComponent({
  components: {
    separator: () => h('span', { class: 'text-2xl text-primary' }, '/'),
    VButton,
    VDropdown,
    VGroup
  },
  setup () {
    const store = useStore<State>()
    const router = useRouter()
    const route = useRoute()
    const dialog = inject<DialogSystem>('dialog')

    const databaseName = computed(() => store.state.database?.name)
    function renameDatabase () {
      if (dialog) {
        dialog.prompt('', {
          title: 'Rename database',
          initialPrompt: store.state.database?.name,
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
    const tableNames = computed(() => Object.keys(store.state.modifications))

    return {
      databaseName,
      renameDatabase,
      tableNames
    }
  }
})
</script>

<style lang="postcss" scoped>
.breadcrumbs {
  @apply flex items-center gap-2;
}

.table-name {
  @apply block max-w-sm overflow-hidden ellipsis;
}
</style>
