<template>
  <section id="home">
    <div 
      class="home__slider"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div 
        class="slider__track" 
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <SliderItem v-for="slide in slides" :key="slide" :name="slide">
          <template v-if="slide === 'home'">
            <div class="welcome-content">
              <h1>Anna Sowa</h1>
              <p>{{ t('home.composer') }}</p>
              <div class="social-links">
                <a href="https://www.facebook.com/anna.sowa.39" target="_blank">
                  <FacebookIcon type="filled" />
                </a>
                <a 
                  href="https://www.youtube.com/channel/UCY2PpgpMVp791-iHQK4JobQ/featured?view_as=subscriber"
                  target="_blank"
                >
                  <YoutubeIcon class="icon-enlarged" type="filled" />
                </a>
                <a href="https://www.instagram.com/sowaanna67/" target="_blank">
                  <InstagramIcon type="filled" />
                </a>
                <a href="https://vimeo.com/user65772597" target="_blank">
                  <VimeoIcon type="filled" />
                </a>
                <a href="https://soundcloud.com/user-288051599" target="_blank">
                  <SoundCloudIcon class="icon-enlarged" type="filled" />
                </a>
              </div>
              <span class="photographer-note">{{ t('home.photographer') }}</span>
            </div>
          </template>
        </SliderItem>
      </div>

      <button v-if="current > 0" class="arrow arrow-left" @click="prev">
        &#8592;
      </button>
      <button v-if="current < slides.length - 1" class="arrow arrow-right" @click="next">
        &#8594;
      </button>

      <div class="slider-dots">
        <span 
          v-for="(_, index) in slides" 
          :key="index"
          class="dot"
          :class="{ active: current === index }"
          @click="current = index"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SliderItem from '../components/SliderItem.vue'
import FacebookIcon from '../components/icons/FacebookIcon.vue'
import InstagramIcon from '../components/icons/InstagramIcon.vue'
import YoutubeIcon from '../components/icons/YoutubeIcon.vue'
import VimeoIcon from '../components/icons/VimeoIcon.vue'
import SoundCloudIcon from '../components/icons/SoundCloud.vue'

const { t } = useI18n()

const slides = ref([ 'home', 'bio', 'compositions', 'news', 'media', 'works', 'gallery' ])
const current = ref(0)

const next = () => {
  if (current.value < slides.value.length - 1) current.value++
}

const prev = () => {
  if (current.value > 0) current.value--
}

// Swipe handling logic
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      next()
    } else {
      prev()
    }
  }
}
</script>

<style lang="scss" scoped>
.home__slider {
  height: calc(100vh - $header-height);
  width: 100%;
  overflow: hidden;
  position: relative;

  .slider__track {
    display: flex;
    height: 100%;
    width: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: translateY(-50%) scale(1.1);
    }

    &-left { left: 2rem; }
    &-right { right: 2rem; }
  }

  .slider-dots {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: none;
    gap: 1.5rem;
    z-index: 10;

    .dot {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: white;
        transform: scale(1.3);
      }
    }
  }
}

.welcome-content {
  color: white;
  text-align: left;
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 124rem;
  z-index: 5;

  h1 {
    font-size: 7rem;
    margin: 0;
    font-weight: 400;
    line-height: 1;
  }

  p {
    font-size: 3.5rem;
    letter-spacing: 0.5rem;
    margin: 0 0 1.5rem;
    line-height: 1;
  }

  .social-links {
    font-size: 4rem;
    display: flex;
    align-items: center;

    a {
      color: $white;
      margin-right: 2rem;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;

      &:hover {
        opacity: 0.7;
      }

      .icon-enlarged {
        font-size: 5.2rem;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .photographer-note {
    display: block;
    margin-top: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

@media (max-width: 100rem) {
  .home__slider {
    .arrow {
      display: none;
    }

    .slider-dots {
      display: flex;
    }
  }

  .welcome-content {
    bottom: 6rem;
    width: 95%;

    h1 {
      font-size: 4.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 2rem;
      letter-spacing: 0.2rem;
      margin: 0 0 2rem;
    }

    .social-links {
      font-size: 2.2rem;
      a {
        margin: 0 0.8rem;
        .icon-enlarged {
          font-size: 2.8rem;
        }
      }
    }
  }
}

@media (max-width: 48rem) {
  .welcome-content {
    h1 {
      font-size: 2.8rem;
    }
    p {
      font-size: 1.3rem;
      letter-spacing: 0.1rem;
    }
  }
}
</style>