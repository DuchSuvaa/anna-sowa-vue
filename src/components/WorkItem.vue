<template>
  <li class="work-item">
    <img :src="work.image" alt="">
    <h3>{{ work.title }}</h3>
    <span>{{ work.year }}</span>
    <span>{{ work.info }}</span>
    <span>{{ work.description }}</span>
  </li>
</template>

<script setup>
const props = defineProps([ 'work' ])

</script>

<style lang="scss" scoped>
li.work-item {
  width: 49%;
  border-left: 2px solid $black;
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

</style>