<template>
  <section id="compositions">
    <ul class="compositions-list" v-if="compositions && compositions.length">
      <li v-for="composition in compositions" :key="composition.id">
        <h2>{{ composition.name?.[locale] }}</h2>
        <p>{{ composition.year }}</p>
        <p>{{ composition.instrumentation?.[locale] }}</p>
      </li>
    </ul>
    <p v-else>No compositions found</p>
    <button v-if="hasMore && compositions.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const compositions = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)

const loadMore = async () => {
  const result = await store.getPaginatedCollection('compositions', lastDoc.value, 10, 'timestamp')
  if (result.docs.length > 0) {
    compositions.value.push(...result.docs)
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