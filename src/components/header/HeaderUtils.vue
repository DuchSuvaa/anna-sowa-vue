<template>
  <div class="social">
    <a v-if="!store.globalSettings.hideSoundcloud" class="social-link soundcloud-link" :href="socialLinks.soundcloud" target="_blank" rel="noopener noreferrer">
      <SoundCloud type="outline"/>
    </a>
    <a v-if="!store.globalSettings.hideVimeo" class="social-link vimeo-link" :href="socialLinks.vimeo" target="_blank" rel="noopener noreferrer">
      <VimeoIcon type="outline"/>
    </a>
    <a v-if="!store.globalSettings.hideInstagram" class="social-link instagram-link" :href="socialLinks.instagram" target="_blank" rel="noopener noreferrer">
      <InstagramIcon type="outline"/>
    </a>
    <a class="social-link mail-link" :href="'mailto:' + (store.globalSettings.contactEmail || 'sowaanna67@gmail.com')" target="_blank" rel="noopener noreferrer">
      <MailIcon type="outline"/>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'
import SoundCloud from '../icons/SoundCloud.vue'
import VimeoIcon from '../icons/VimeoIcon.vue'
import InstagramIcon from '../icons/InstagramIcon.vue'
import MailIcon from '../icons/MailIcon.vue'

const { locale, t } = useI18n()
const store = useStore()

const socialLinks = computed(() => ({
  soundcloud: store.globalSettings.soundcloudUrl || 'https://soundcloud.com/user-288051599',
  vimeo: store.globalSettings.vimeoUrl || 'https://vimeo.com/user65772597',
  instagram: store.globalSettings.instagramUrl || 'https://www.instagram.com/sowaanna67/'
}))

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
    img, svg {
      width: 100%;
      height: auto;
    }
  }

  .instagram-link {
    width: 2.8rem;
  }

  .mail-link {
    width: 3.2rem;
  }

  .lang {
    margin-right: 0;
    padding-bottom: 0.5rem;
  }

  a:hover {
    img, svg {
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
