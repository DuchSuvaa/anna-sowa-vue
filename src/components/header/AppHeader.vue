<template>
  <header>
    <div>
      <div id="logo">
        <RouterLink to="/">
          Anna
          <br/>
          <strong>Sowa</strong>
        </RouterLink>
      </div>
      <AppNavigation/>
      <HeaderUtils/>
      <div class="hamburger">
        <HamburgerIcon />
      </div>
    </div>
  </header>
</template>

<script setup>
import AppNavigation from './AppNavigation.vue'
import HeaderUtils from './HeaderUtils.vue'
import HamburgerIcon from '../icons/HamburgerIcon.vue'

</script>

<style lang="scss" scoped>
header {
  width: 100%;
  > div {
    width: 90%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 10px 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  div#logo {
    font-size: 2.5rem;
    line-height: 2.5rem;
    cursor: pointer;
    a {
      color: $black;
      user-select: none;
      text-decoration: none;
      text-transform: uppercase;
    }
    img {
      display: none;
    }
  }
  .hamburger {
    display: none;
    svg {
      font-size: 4rem;
    }
  }
}


@media (max-width: 1100px) {
  header {
    .hamburger {
      display: flex;
    }
    nav {
      display: none;
    }
  }
}
</style>