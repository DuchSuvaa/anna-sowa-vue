<template>
  <section id="compositions">
    <div class="content">
      <SectionSortControls 
        v-if="compositions && compositions.length" 
        :direction="sortDirection" 
        @toggle="toggleSort"
      />
      <ul class="compositions-list" v-if="compositions && compositions.length">
        <CompositionItem 
          v-for="composition in compositions" 
          :key="composition.id" 
          :composition="composition" 
        />
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
import CompositionItem from '../components/CompositionItem.vue'
import SectionSortControls from '../components/SectionSortControls.vue'

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
  const limitCount = store.globalSettings?.itemsPerPage || 10
  const result = await store.getPaginatedCollection('compositions', lastDoc.value, limitCount, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    compositions.value.push(...result.docs)
    lastDoc.value = result.lastVisible
  }
  if (result.docs.length < limitCount) {
    hasMore.value = false
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
</style>