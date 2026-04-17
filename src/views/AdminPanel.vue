<template>
  <section>
    <h1>Admin</h1>
    <button @click="logout">Logout</button>
  </section>
</template>

<script setup>
import { useStore } from '../pinia/store'

const store = useStore()

const logout = () => {
  store.logout()
}
</script>

<style scoped>

</style>