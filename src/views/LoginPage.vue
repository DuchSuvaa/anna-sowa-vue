<template>
  <section id="login">
    <div  class="content">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="email">email</label>
        <input type="email" id="email" v-model="loginForm.email">
        <label for="password">password</label>
        <input type="password" id="password" v-model="loginForm.password">
        <button>Login</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useStore } from '../pinia/store'
const loginForm = {
  email: '',
  password: ''
}

const store = useStore()
const login = () => {
  store.login(loginForm.email, loginForm.password)
}
</script>

<style lang="scss" scoped>
#login {
  background-image: url('/bg-home.jpg');
}
</style>