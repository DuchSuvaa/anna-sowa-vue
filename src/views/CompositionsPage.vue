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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const compositions = ref([])

onMounted(async () => {
  compositions.value = await store.getCollection('compositions')
})
</script>

<style lang="scss" scoped>

</style>