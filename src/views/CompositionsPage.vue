<template>
  <section id="compositions">
    <div class="content">
      <ul class="compositions-list" v-if="compositions && compositions.length">
        <li v-for="composition in compositions" :key="composition.id">
          <h2>{{ composition.name?.[locale] }}</h2>
          <p>{{ composition.year }}</p>
          <p>{{ composition.instrumentation?.[locale] }}</p>
        </li>
      </ul>
      <p v-else>No compositions found</p>
      <button v-if="hasMore && compositions.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
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
#compositions {
  background-image: url('../public/bg-compositions.jpg');
}
</style>