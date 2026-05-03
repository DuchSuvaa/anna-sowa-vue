<template>
  <section id="compositions">
    <div class="content">
      <div class="sort-controls" v-if="compositions && compositions.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="compositions-list" v-if="compositions && compositions.length">
        <li v-for="composition in compositions" :key="composition.id">
          <h2>{{ composition.name?.[locale] }}</h2>
          <p>{{ composition.year }}</p>
          <p>{{ composition.instrumentation?.[locale] }}</p>
        </li>
      </ul>
      <p v-else>No compositions found</p>
      <button v-if="hasMore && compositions.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }}</button>
    </div>
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
const sortDirection = ref('asc')

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  compositions.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  const result = await store.getPaginatedCollection('compositions', lastDoc.value, 10, 'order', sortDirection.value)
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
#compositions {
  background-image: url('/bg-compositions.jpg');
}

.sort-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  
  .sort-btn {
    background-color: rgba(255, 255, 255, 0.8);
    color: #333;
    padding: 0.8rem 1.6rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }
  }
}
</style>