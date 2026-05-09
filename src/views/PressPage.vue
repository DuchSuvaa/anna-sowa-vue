<template>
  <section id="press">
    <div class="content">
      <SectionSortControls 
        v-if="press && press.length" 
        :direction="sortDirection" 
        @toggle="toggleSort"
      />
      <ul class="press-list" v-if="press && press.length">
        <PressItem 
          v-for="item in press" 
          :key="item.id" 
          :item="item" 
        />
      </ul>
      <p v-else>No press items found</p>
      <button v-if="hasMore && press.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }} </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../pinia/store'
import PressItem from '../components/PressItem.vue'
import SectionSortControls from '../components/SectionSortControls.vue'

const { locale } = useI18n()
const store = useStore()
const press = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)
const sortDirection = ref('asc')

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  press.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  const limitCount = store.globalSettings?.itemsPerPage || 10
  const result = await store.getPaginatedCollection('press', lastDoc.value, limitCount, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    press.value.push(...result.docs)
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
#press {
  background-image: url('/bg-media.jpg');
}

.press-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>