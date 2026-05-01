<template>
  <header>
    <div>
      <div id="logo">
        <RouterLink to="/" @click="isMenuOpen = false">
          Anna
          <br/>
          <strong>Sowa</strong>
        </RouterLink>
      </div>
      
      <div class="menu-overlay" :class="{ 'is-open': isMenuOpen }">
        <AppNavigation @click="isMenuOpen = false" />
        <HeaderUtils />
      </div>

      <div class="hamburger" @click="isMenuOpen = !isMenuOpen" :class="{ 'is-open': isMenuOpen }">
        <HamburgerIcon />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import AppNavigation from './AppNavigation.vue'
import HeaderUtils from './HeaderUtils.vue'
import HamburgerIcon from '../icons/HamburgerIcon.vue'

const isMenuOpen = ref(false)

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
    position: relative;
    z-index: 1000; /* Keeps logo above mobile menu */
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
  
  .menu-overlay {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;

    /* Centers the navigation by pushing it with auto margins, while keeping utils at the end */
    :deep(nav) {
      margin: 0 auto;
    }
  }

  .hamburger {
    display: none;
    position: relative;
    z-index: 1000; /* Keeps hamburger above mobile menu */
    cursor: pointer;
    svg {
      font-size: 4rem;
    }
  }
}

@media (max-width: 1000px) {
  header {
    .hamburger {
      display: flex;
      align-items: center;
    }
    
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      z-index: 999;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      gap: 3rem;
      
      /* Hidden state by default */
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-20px);
      transition: all 0.3s ease-in-out;
      
      &.is-open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0);
      }

      /* Assuming elements inside might need column layout spacing */
      :deep(nav) {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }
    }
  }
}
</style>