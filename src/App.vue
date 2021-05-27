<template>
  <aside>
    <header>{{ database.name }}</header>
    <main></main>
    <footer>
      <span @click="file.open">Open Database</span>
      <span @click="file.save">Write Database</span>
    </footer>
  </aside>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { fileOpen, fileSave, FileSystemHandle } from 'browser-fs-access'
import { Database, SqlJsStatic } from 'sql.js'

const EXTENSIONS = ['.db', '.sqlite', '.sqlite3']

export default defineComponent({
  setup () {
    const sqlite3 = inject<SqlJsStatic>('sqlite3')
    const handle = ref<FileSystemHandle|undefined>(undefined)
    const db = ref<Database|null>(null)
    const file = {
      async open () {
        const file = await fileOpen({
          mimeTypes: ['application/vnd.sqlite3'],
          extensions: EXTENSIONS
        })
        if (sqlite3) {
          db.value = new sqlite3.Database(new Uint8Array(await file.arrayBuffer()))
        }
        handle.value = file.handle
      },
      async save () {
        if (db.value) {
          const file = new File([db.value.export()], handle.value?.name ?? 'database.db', {
            type: 'application/vnd.sqlite3'
          })

          const newHandle = await fileSave(file,
            {
              fileName: handle.value?.name,
              extensions: EXTENSIONS
            },
            handle.value,
            false
          )

          handle.value = newHandle
        }
      }
    }

    return {
      file,
      database: {
        name: 'Database Name'
      }
    }
  }
})
</script>

<style lang="postcss">
#app {
  @apply h-screen;
  @apply flex;
  @apply bg-gray-100;
}

#app > aside {
  @apply w-60;
  @apply bg-white;
  @apply rounded-3xl;
  @apply shadow-md;
  @apply flex flex-col;
}

#app > aside header {
  @apply p-4;
  @apply text-xl;
  @apply font-extrabold;
}

#app > aside main {
  @apply flex-grow;
}
</style>
