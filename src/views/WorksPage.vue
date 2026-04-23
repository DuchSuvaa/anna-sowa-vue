<template>
  <section id="works">
    <div v-for="work in works" :key="work.id">
      <img :src="work.image" alt="">
      <h2>{{ work.title }}</h2>
      <h2>{{ work.year }}</h2>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'

const store = useStore()
const works = ref([])

onMounted(async () => {
  works.value = await store.getCollection('works')
})
</script>

<style lang="scss" scoped>

</style>