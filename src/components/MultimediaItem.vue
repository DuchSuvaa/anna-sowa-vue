<template>
  <li class="work-item">
    <MediaPlayer v-if="work.link" :url="work.link" />
    <img v-else-if="work.image" :src="work.image" alt="">
    <h3>{{ work.title }}</h3>
    <span>{{ work.year }}</span>
    <span>{{ work.info?.[locale] }}</span>
    <span>{{ work.description?.[locale] }}</span>
  </li>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import MediaPlayer from './MediaPlayer.vue'

const props = defineProps([ 'work' ])

const { locale } = useI18n()

</script>

<style lang="scss" scoped>
li.work-item {
  width: 49%;
  font-size: 2.4rem;
  padding-left: 3rem;
  margin-bottom: 4rem;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  h3 {
    margin: 0;
    font-size: 2rem;
  }
  span {
    display: block;
    font-size: 2rem;
  }
}

@media (max-width: 750px) {
  li.work-item {
    width: 95%;
  }
}

</style>