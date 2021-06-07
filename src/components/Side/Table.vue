<template>
  <router-link :to="{name: 'Table', params: { name }}" custom v-slot="{ navigate, isActive }">
    <div @click.self="navigate">
      <input type="text" :value="name" :disabled="!edit" ref="newName">
      <span v-if="isActive">
        <icon :icon="edit ? 'times' : 'pen'" @click="button.one"/>
        <icon :icon="edit ? 'check' : 'trash'" @click="button.two" />
      </span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUpdate, ref, toRefs, watch } from 'vue'
import Icon from '@/components/Icon.vue'
import { useTables } from '@/database'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  props: ['name'],
  components: { Icon },
  setup (props) {
    const edit = ref(false)
    const newName = ref<HTMLInputElement>()

    const { name } = toRefs(props)
    const { drop, list, rename } = useTables()

    const router = useRouter()
    const route = useRoute()

    const button = {
      one () {
        edit.value = !edit.value
        nextTick().then(() => newName.value && newName.value.focus())
      },
      two () {
        if (edit.value && newName.value) {
          rename(props.name, newName.value.value)
          router.replace({ params: { name: newName.value.value } })
        } else if (confirm(`Are you sure you want to delete '${name.value}'`)) {
          if (list.value.length > 1) {
            // there are other tables so push to next table
            // get the next table name
            const nextName = list.value[
              (list.value.indexOf(name.value) + 1) % list.value.length
            ]
            router.push(`/table/${nextName}`)
          } else router.push('/') // no tables so push /
          drop(name.value)
        }
      }
    }

    watch(() => route.params.name, () => (edit.value = false))

    return { edit, button, newName }
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
}

input {
  @apply block;
  @apply text-base;
  @apply font-medium;
  @apply leading-snug;
  @apply rounded;
  @apply px-1 py-0.5;
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
