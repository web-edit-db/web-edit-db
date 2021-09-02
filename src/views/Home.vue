<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <h1>Web Edit DB</h1>
    <p>
      Web Edit DB is a free browser-based SQLite database editor.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home'
})
</script>

<style lang="postcss" scoped>
.home {
  @apply flex flex-col justify-center items-center gap-3;
  @apply h-full;
}

img {
  @apply h-20;
}

h1 {
  @apply text-2xl;
  @apply text-primary;
}
</style>
