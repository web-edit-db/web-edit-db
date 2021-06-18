<template>
  <div
    v-is="'fa-icon'"
    v-bind="wrapper"
    @click="$emit('click', $event)"
    :key="{ ...$attrs }"
  >
    <fa v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faChevronLeft, faFile, faFileUpload, faPen, faPlus, faSave, faTimes, faTrash, faTrashRestore, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faFileUpload,
  faSave,
  faFile,
  faPen,
  faTrash,
  faTrashRestore,
  faTimes,
  faCheck,
  faChevronLeft,
  faPlus,
  faUndoAlt
)

export default defineComponent({
  name: 'icon',
  emits: ['click'],
  props: ['wrapper'],
  inheritAttrs: false,
  components: {
    fa: FontAwesomeIcon
  }
})
</script>

<style lang="postcss" scoped>
fa-icon {
  @apply cursor-pointer;
  @apply flex justify-center items-center;
}
</style>
