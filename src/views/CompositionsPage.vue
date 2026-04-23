<template>
  <section id="compositions">
    <ul class="compositions-list" v-if="compositions && compositions.length">
      <li v-for="composition in compositions" :key="composition.id">
        <h2>{{ composition.name.en }}</h2>
        <p>{{ composition.year }}</p>
      </li>
    </ul>
    <p v-else>No compositions found</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'

const store = useStore()
const compositions = ref([])

onMounted(async () => {
  compositions.value = await store.getCollection('compositions')
})
</script>

<style lang="scss" scoped>

</style>