<template>
  <nav>
    <RouterLink to="/compositions">Compositions</RouterLink>
    <RouterLink to="/news">News</RouterLink>
    <RouterLink to="/works">Works</RouterLink>
    <RouterLink to="/media">Media</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/admin">Admin</RouterLink>
  </nav>
</template>

<script setup>

</script>

<style lang="scss" scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 1.5em;
  user-select: none;
  a {
    text-decoration: none;
    margin-right: 2rem;
    font-size: 1.5rem;
    &.router-link-active {
      font-weight: bold;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>