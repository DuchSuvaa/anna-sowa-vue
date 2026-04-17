<template>
  <AppHeader/>
  <router-view></router-view>
  <NotificationBox v-if="store.notification">{{ store.notification }}</NotificationBox>
  <ErrorBox v-if="store.error">{{ store.error }}</ErrorBox>
</template>

<script setup>
import { useStore } from './pinia/store'
import AppHeader from './components/header/AppHeader.vue'
import NotificationBox from './components/NotificationBox.vue'
import ErrorBox from './components/ErrorBox.vue'

const store = useStore()

</script>

<style lang="scss">

</style>
