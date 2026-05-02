<template>
  <nav>
    <RouterLink to="/bio">{{ t('nav.bio') }}</RouterLink>
    <RouterLink to="/compositions">{{ t('nav.compositions') }}</RouterLink>
    <RouterLink to="/news">{{ t('nav.news') }}</RouterLink>
    <RouterLink to="/media">{{ t('nav.media') }}</RouterLink>
    <RouterLink to="/works">{{ t('nav.works') }}</RouterLink>
    <RouterLink to="/gallery">{{ t('nav.gallery') }}</RouterLink>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

@media (max-width: 100rem) {
  nav {
    a {
      margin-right: 0;
    }
  }
}
</style>