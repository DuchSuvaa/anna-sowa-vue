<template>
  <section id="works">
    <div class="content">
      <div v-if="works && works.length">
        <div v-for="work in works" :key="work.id">
          <img :src="work.image" alt="">
          <h2>{{ work.title }}</h2>
          <h2>{{ work.year }}</h2>
        </div>
      </div>
      <p v-else>No works found</p>
      <button v-if="hasMore && works.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
    </div>
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
#works {
  background-image: url('../public/bg-works.jpg');
}
</style>