<template>
  <section id="compositions">
    <div class="content">
      <div class="filters-and-sort">
        <div class="filter-controls">
          <button 
            v-for="type in filterTypes" 
            :key="type"
            :class="{ active: currentFilter === type }"
            @click="setFilter(type)"
            class="filter-btn"
          >
            {{ type === 'All' ? $t('general.filtering.all') || 'All' : $t('general.filtering.' + type.toLowerCase()) || type }}
          </button>
        </div>
        <SectionSortControls 
          v-if="displayedCompositions && displayedCompositions.length" 
          :direction="sortDirection" 
          @toggle="toggleSort"
        />
      </div>
      <ul class="compositions-list" v-if="displayedCompositions && displayedCompositions.length">
        <CompositionItem 
          v-for="composition in displayedCompositions" 
          :key="composition.id" 
          :composition="composition" 
        />
      </ul>
      <LoadingSpinner v-if="isLoading" />
      <p v-else-if="!displayedCompositions || displayedCompositions.length === 0">No compositions found</p>
      
      <button v-if="hasMore && !isLoading && displayedCompositions && displayedCompositions.length > 0" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }}</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'
import CompositionItem from '../components/CompositionItem.vue'
import SectionSortControls from '../components/SectionSortControls.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { locale } = useI18n()
const store = useStore()

const filterTypes = ['All', 'Orchestral', 'Chamber', 'Solo', 'Installations', 'Dance', 'Children']
const sortDirection = ref('asc')
const currentFilter = ref('All')
const isLoading = ref(true)

// Initialize Cache
const cache = ref({})
const initializeCache = () => {
  filterTypes.forEach(type => {
    cache.value[type] = {
      docs: [],
      lastDoc: null,
      hasMore: true
    }
  })
}
initializeCache()

const displayedCompositions = computed(() => {
  if (currentFilter.value === 'All') {
    // Collect all unique docs from all caches to show everything downloaded so far
    const allDocsMap = new Map()
    Object.values(cache.value).forEach(category => {
      category.docs.forEach(doc => {
        allDocsMap.set(doc.id, doc)
      })
    })
    const merged = Array.from(allDocsMap.values())
    // Sort them
    merged.sort((a, b) => {
      const orderA = a.order !== undefined ? Number(a.order) : 0
      const orderB = b.order !== undefined ? Number(b.order) : 0
      return sortDirection.value === 'asc' ? orderA - orderB : orderB - orderA
    })
    return merged
  }
  if (sortDirection.value === 'desc') {
    return [...cache.value[currentFilter.value].docs].reverse()
  }
  return cache.value[currentFilter.value].docs
})

const hasMore = computed(() => cache.value[currentFilter.value].hasMore)

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const setFilter = async (type) => {
  if (currentFilter.value === type) return
  currentFilter.value = type
  
  // Only load if we haven't loaded anything yet and we still think there's more
  if (cache.value[type].docs.length === 0 && cache.value[type].hasMore) {
    await loadMore()
  }
}

const loadMore = async () => {
  const filter = currentFilter.value
  const limitCount = store.globalSettings?.itemsPerPage || 10
  
  const filterField = filter === 'All' ? null : 'type'
  const filterValue = filter === 'All' ? null : filter
  
  isLoading.value = true
  
  try {
    const result = await store.getPaginatedCollection(
      'compositions', 
      cache.value[filter].lastDoc, 
      limitCount, 
      'order', 
      'asc', // Always fetch ascending from Firebase
      filterField,
      filterValue
    )
    
    if (result.docs.length > 0) {
      cache.value[filter].docs.push(...result.docs)
      cache.value[filter].lastDoc = result.lastVisible
    }
    
    if (result.docs.length < limitCount) {
      cache.value[filter].hasMore = false
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await store.loadSettings()
  await loadMore()
})
</script>

<style lang="scss" scoped>
#compositions {
  background-image: url('/bg-compositions.jpg');
}

.compositions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filters-and-sort {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.filter-btn {
  background-color: transparent;
  border: 1px solid #333;
  color: #333;
  padding: 0.4rem 1.2rem;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background-color: #333;
    color: #fff;
  }
}

@media (min-width: 768px) {
  .filters-and-sort {
    flex-direction: row;
    justify-content: space-between;
  }
}

// @media (max-width: 900px) {
//   .content {
//     width: 100vw;
//     height: 100vh;
//     height: 100dvh;
//     max-width: none;
//     margin: 0;
//     border-radius: 0;
//     padding: 2rem;
//   }
// }
</style>