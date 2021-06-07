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
import { defineComponent, nextTick, ref, toRefs } from 'vue'
import Icon from '@/components/Icon.vue'
import { useTables } from '@/database'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: ['name'],
  components: { Icon },
  setup (props) {
    const edit = ref(false)
    const newName = ref<HTMLInputElement>()
    const { name } = toRefs(props)
    const { drop, list, rename } = useTables()
    const router = useRouter()

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

    return { edit, button, newName }
  }
})
</script>

<style lang="postcss" scoped>
div {
  @apply m-1.5;
  @apply bg-gray-100;
  @apply flex-col flex;
  @apply py-2.5 px-3;
  @apply rounded-md;
}

div input {
  @apply block;
  @apply p-0.5;
  @apply text-lg;
  @apply leading-none;
}

div input:disabled {
  @apply bg-transparent;
  @apply select-none;
  @apply pointer-events-none;
}

div span {
  @apply flex;
}

div span fa-icon {
  @apply h-6 w-6;
}
</style>
