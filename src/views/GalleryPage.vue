<template>
  <section id="gallery-page">
    <div class="content">

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="galleries.length === 0" class="empty">No galleries found.</div>
      
      <div v-else class="albums-grid">
        <RouterLink 
          v-for="album in galleries" 
          :key="album.id"
          :to="'/gallery/' + album.id"
          class="album-card"
        >
          <div class="album-cover">
            <ResponsiveImage 
              v-if="album.photos && album.photos.length > 0"
              :publicId="album.photos[0].public_id"
              :alt="album.name[locale] || album.title"
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div v-else class="no-cover">No Photos</div>
          </div>
          <div class="album-info">
            <h3>{{ album.name[locale] || album.title }}</h3>
            <span>{{ album.photos ? album.photos.length : 0 }} photos</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { db } from '../firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import ResponsiveImage from '../components/ResponsiveImage.vue'

const { t, locale } = useI18n()
const galleries = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const q = query(collection(db, 'galleries'), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    const fetched = []
    querySnapshot.forEach((doc) => {
      fetched.push({ id: doc.id, ...doc.data() })
    })
    galleries.value = fetched
  } catch (error) {
    console.error("Error loading galleries: ", error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
#gallery-page {
  background-image: url('/bg-gallery.jpg');
}
.page-title {
  font-size: 4rem;
  margin-bottom: 3rem;
  color: #333;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 3rem;
  padding-bottom: 4rem;
}

.album-card {
  text-decoration: none;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0.4rem 1rem rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.15);
  }

  .album-cover {
    width: 100%;
    height: 25rem;
    background: #f0f0f0;
    overflow: hidden;

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover .album-cover :deep(img) {
    transform: scale(1.05);
  }

  .no-cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 1.6rem;
  }

  .album-info {
    padding: 1.5rem 2rem;

    h3 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      color: #222;
    }

    span {
      font-size: 1.4rem;
      color: #777;
    }
  }
}

.loading, .empty {
  font-size: 1.8rem;
  color: #666;
}
</style>
