<template>
  <section class="things">
    <h1>Home</h1>
    <span>Document:</span>
    <div>
      {{ thing }}
    </div>
    <span>Collection:</span>
    <div v-for="thing in things" :key="thing">
      {{ thing }}
    </div>
      <button>Button</button>
  </section>
</template>

<script setup>
import { useStore } from '../pinia/store'
import { onMounted, ref } from 'vue'

const store = useStore()
const things = ref(null)
const thing = ref(null)

onMounted(async () => {
  thing.value = await store.getDocument('stuff', 'folder')
  things.value = await store.getCollection('stuff', 'folder', 'items')
})

</script>

<style scoped>

</style>