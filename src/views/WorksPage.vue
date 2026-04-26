<template>
  <section id="works">
    <div v-if="works && works.length">
      <div v-for="work in works" :key="work.id">
        <img :src="work.image" alt="">
        <h2>{{ work.title }}</h2>
        <h2>{{ work.year }}</h2>
      </div>
    </div>
    <p v-else>No works found</p>
    <button v-if="hasMore && works.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'

const store = useStore()
const works = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)

const loadMore = async () => {
  const result = await store.getPaginatedCollection('works', lastDoc.value, 10, null)
  if (result.docs.length > 0) {
    works.value.push(...result.docs)
    lastDoc.value = result.lastVisible
  }
  if (result.docs.length < 10) {
    hasMore.value = false
  }
}

onMounted(async () => {
  await loadMore()
})
</script>

<style lang="scss" scoped>
.load-more-btn {
  display: block;
  margin: 2rem auto;
  padding: 10px 20px;
  background-color: var(--color-text, #333);
  color: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #333);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>