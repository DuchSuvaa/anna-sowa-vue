<template>
  <section class="gallery-album-page">
    <div class="content">
      <div class="header-nav">
        <RouterLink to="/gallery" class="back-link">← {{ locale === 'pl' ? 'Wróć' : 'Back' }}</RouterLink>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="!album" class="error">Album not found.</div>
      
      <div v-else>
        <h2 class="page-title">{{ album.name[locale] || album.title }}</h2>
        
        <div v-if="!album.photos || album.photos.length === 0" class="empty">
          No photos in this album yet.
        </div>
        
        <div v-else class="masonry-grid">
          <div 
            v-for="(photo, index) in album.photos" 
            :key="photo.public_id"
            class="masonry-item"
            @click="openLightbox(index)"
          >
            <ResponsiveImage 
              :publicId="photo.public_id"
              :alt="album.name[locale] + ' photo ' + (index+1)"
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Very basic lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="close-btn" @click="closeLightbox">×</button>
        <button class="nav-btn prev" @click="prevPhoto" v-if="currentPhotoIndex > 0">‹</button>
        
        <ResponsiveImage 
          v-if="currentPhoto"
          :publicId="currentPhoto.public_id"
          :alt="'Photo'"
          sizes="100vw"
          class="lightbox-img"
        />
        
        <button class="nav-btn next" @click="nextPhoto" v-if="currentPhotoIndex < album.photos.length - 1">›</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import ResponsiveImage from '../components/ResponsiveImage.vue'

const { locale } = useI18n()
const route = useRoute()

const album = ref(null)
const loading = ref(true)

// Lightbox state
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)
const currentPhoto = computed(() => album.value?.photos[currentPhotoIndex.value])

onMounted(async () => {
  try {
    const docRef = doc(db, 'galleries', route.params.id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      album.value = { id: docSnap.id, ...docSnap.data() }
    }
  } catch (error) {
    console.error("Error loading album: ", error)
  } finally {
    loading.value = false
  }
  
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const openLightbox = (index) => {
  currentPhotoIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextPhoto = () => {
  if(currentPhotoIndex.value < album.value.photos.length - 1) {
    currentPhotoIndex.value++
  }
}

const prevPhoto = () => {
  if(currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
}

</script>

<style lang="scss" scoped>
.gallery-album-page {
  background-image: url('/bg-gallery.jpg');
}

.header-nav {
  margin-bottom: 2rem;
}

.back-link {
  font-size: 1.6rem;
  color: #666;
  text-decoration: none;
  &:hover {
    color: #333;
    text-decoration: underline;
  }
}

.page-title {
  font-size: 4rem;
  margin-bottom: 3rem;
  color: #333;
}

/* CSS Masonry */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  padding-bottom: 4rem;
  align-items: start;
  
  @media (min-width: 600px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1000px) { grid-template-columns: repeat(3, 1fr); }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 2rem;
  cursor: zoom-in;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0.2rem 0.6rem rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: 0 0.4rem 1.2rem rgba(0,0,0,0.15);
  }

  :deep(img) {
    width: 100%;
    height: auto;
    display: block; // removes bottom gap
  }
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.lightbox-img) {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: -4rem;
  right: -2rem;
  background: none;
  border: none;
  color: white;
  font-size: 4rem;
  cursor: pointer;
  line-height: 1;
  @media (max-width: 768px) {
    right: 0;
  }
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  font-size: 5rem;
  cursor: pointer;
  padding: 1rem 2rem;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
  
  &.prev { left: -6rem; @media (max-width: 768px) { left: 0; } }
  &.next { right: -6rem; @media (max-width: 768px) { right: 0; } }
}
</style>
