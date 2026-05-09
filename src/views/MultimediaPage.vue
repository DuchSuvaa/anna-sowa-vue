<template>
  <section id="multimedia">
    <div class="content">
      <div v-if="multimedia && multimedia.length">
        <h2>Chamber Music</h2>
        <ul>
          <WorkItem :work="work" v-for="work in chamberWorks" :key="work.id"/>
        </ul>
        <h2>Installation</h2>
        <ul>
          <WorkItem :work="work" v-for="work in installationWorks" :key="work.id"/>
        </ul>
        <h2>Orchestral Music</h2>
        <ul>
          <WorkItem :work="work" v-for="work in orchestralWorks" :key="work.id"/>
        </ul>
      </div>
      <p v-else>No multimedia found</p>
      <button v-if="hasMore && multimedia.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }} </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from '../pinia/store'
import WorkItem from '../components/WorkItem.vue'

const store = useStore()
const multimedia = ref([])

const chamberWorks = computed(() => multimedia.value.filter(w => w['music-type'] === 'Chamber' || w['music-type'] === 'chamber'))
const installationWorks = computed(() => multimedia.value.filter(w => w['music-type'] === 'Installation' || w['music-type'] === 'Installations'))
const orchestralWorks = computed(() => multimedia.value.filter(w => w['music-type'] === 'Orchestral' || w['music-type'] === 'orchestral'))

onMounted(async () => {
  multimedia.value = await store.getCollection('multimedia')
})
</script>

<style lang="scss" scoped>
#multimedia {
  background-image: url('/bg-works.jpg');
  .content {
    div {
      h2 {
        text-align: center;
        text-transform: uppercase;
        margin-bottom: 4rem;
        font-size: 3rem;
      }
      ul {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-flow: row wrap;
      }
    }
  }
}
</style>