<template>
  <div class="social">
    <a href="https://soundcloud.com/user-288051599" target="_blank">
      <img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/soundcloud.png" alt="SoundCloud">
    </a>
    <a href="https://vimeo.com/user65772597" target="_blank">
      <img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/vimeo.png" alt="Vimeo">
    </a>
    <a href="https://www.instagram.com/sowaanna67/" target="_blank">
      <img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/instagram.png" alt="Instagram">
    </a>
    <a :href="'mailto:' + (store.globalSettings.contactEmail || 'sowaanna67@gmail.com')" target="_blank">
      <img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/mail.png" alt="Mail">
    </a>
    <a class="lang"> 
      <div> 
        <div @click="setLocale(locale === 'en' ? 'pl' : 'en')">
          {{ locale === 'en' ? 'PL' : 'EN' }}
        </div> 
        <div @click="setLocale(locale === 'en' ? 'en' : 'pl')">
          {{ locale === 'en' ? 'EN' : 'PL' }}
        </div> 
      </div> 
    </a>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'

const { locale } = useI18n()
const store = useStore()

const setLocale = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style lang="scss" scoped>
div.social {
  display: flex;
  align-items: center;
  a {
    font-size: 2rem;
    text-decoration: none;
    margin-right: 1.6rem;
    width: 3rem;
    img {
      width: 100%;
    }
    &:last-child {
      margin-right: 0;
      padding-bottom: 0.5rem;
    }
    &:nth-child(3) {
      width: 2.8rem;
    }
  }
  a:last-child {
    width: 3.2rem;
  }
  a:hover {
    img {
      opacity: .75;
    }
  }
  .lang {
    height: 3rem;
    width: 2.7rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 6rem;
      position: absolute;
      bottom: 0;
      left: 0;
      transition: bottom .3s;
      font-size: 2rem;
    }
  }
  .lang:hover {
    > div {
      bottom: -2.6rem;
    }
  }
}
</style>