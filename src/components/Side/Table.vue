<template>
  <router-link :to="{name: 'Table', params: { name }}" custom v-slot="{ navigate, isActive }">
    <div @click.self="navigate" @keyup.self.enter="navigate" tabindex="0" >
      <input type="text" :value="name" :disabled="!edit" ref="tableNameInput" @keyup.enter="() => edit && button.two()">
      <span v-if="isActive">
        <icon :icon="edit ? 'times' : 'pen'" @click="button.one"/>
        <icon :icon="edit ? 'check' : 'trash'" @click="button.two" />
      </span>
    </div>
  </router-link>
</template>

<script lang="ts">
import Icon from '@/components/Icon.vue'
import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  props: ['name'],
  components: { Icon },
  setup (props) {
    const edit = ref(false)
    const tableNameInput = ref<HTMLInputElement>()

    const { name } = toRefs(props)

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const tables = computed<string[]>(() => store.getters.tableNames)

    const button = {
      one () {
        edit.value = !edit.value
        nextTick().then(() => tableNameInput.value && tableNameInput.value.focus())
      },
      two () {
        if (edit.value && tableNameInput.value) {
          store.dispatch('renameTable', { tableName: props.name, newTableName: tableNameInput.value.value })
          router.replace({ params: { name: tableNameInput.value.value } })
        } else if (confirm(`Are you sure you want to delete '${name.value}'`)) {
          if (tables.value.length > 1) {
            // there are other tables so push to next table
            // get the next table name
            const nextName = tables.value[
              (tables.value.indexOf(name.value) + 1) % tables.value.length
            ]
            router.push(`/table/${nextName}`)
          } else router.push('/') // no tables so push /
          store.dispatch('dropTable', name.value)
        }
      }
    }

    watch(() => route.params.name, () => (edit.value = false))

    return { edit, button, tableNameInput }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply flex flex-col;
  @apply bg-gray-100;
  @apply px-3 py-2.5;
  @apply rounded-md;
  @apply mb-2;
  @apply outline-none;

  &:focus {
    @apply ring-2 ring-blue-400;
  }
}

input {
  @apply block;
  @apply text-base;
  @apply font-medium;
  @apply leading-snug;
  @apply rounded;
  @apply px-1 py-0.5;
  @apply border-none;
  @apply outline-none;

  &:disabled {
    @apply bg-transparent;
    @apply select-none;
    @apply pointer-events-none;
  }
}

span {
  @apply flex;
  @apply mt-1;

  & fa-icon {
    @apply h-6 w-6;
    @apply mr-1;
    @apply rounded;

    &:hover {
      @apply bg-white;
    }
  }
}
</style>
