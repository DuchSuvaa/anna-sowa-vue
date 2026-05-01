<template>
  <section id="admin">
    <div class="admin-layout">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <h2 class="sidebar-title">Admin Panel</h2>
        <ul class="nav-list">
          <li 
            v-for="navItem in navItems" 
            :key="navItem.id"
            :class="{ active: currentView === navItem.id }"
            @click="currentView = navItem.id"
            class="nav-item"
          >
            {{ navItem.label }}
          </li>
        </ul>
        <div class="sidebar-bottom">
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Drill-down Edit Mode -->
        <div v-if="editingItem" class="edit-view">
          <AdminEditor 
            :item="editingItem" 
            :collectionName="currentCollectionId" 
            @back="editingItem = null" 
          />
        </div>
        
        <!-- List View -->
        <div v-else-if="currentView === 'settings'" class="settings-view">
          <h2>Settings</h2>
          <p>Welcome to the admin panel. Select a post type from the sidebar to manage its content.</p>
          <!-- Future settings components go here -->
        </div>
        
        <div v-else class="collection-view">
          <AdminListItems 
            :collectionName="currentCollectionId" 
            :title="currentCollectionTitle" 
            @edit-item="onEditItem"
          />
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from '../pinia/store'
import AdminListItems from '../components/admin/AdminListItems.vue'
import AdminEditor from '../components/admin/AdminEditor.vue'

const store = useStore()
const currentView = ref('settings')
const editingItem = ref(null)

// Reset editing state when changing tabs
watch(currentView, () => {
  editingItem.value = null
})

// Updated order based on user feedback
const navItems = [
  { id: 'settings', label: 'Settings', collection: false },
  { id: 'biography', label: 'Bio', collection: true },
  { id: 'compositions', label: 'Compositions', collection: true },
  { id: 'news', label: 'News', collection: true },
  { id: 'media', label: 'Media', collection: true },
  { id: 'works', label: 'Works', collection: true }
]

const currentNavItem = computed(() => navItems.find(item => item.id === currentView.value))
const currentCollectionId = computed(() => currentNavItem.value?.id)
const currentCollectionTitle = computed(() => currentNavItem.value?.label)

const onEditItem = (item) => {
  editingItem.value = item
}

const logout = () => {
  store.logout()
}
</script>

<style lang="scss" scoped>
#admin {
  background-image: url('/bg-home.jpg'); 
  background-size: cover;
  background-position: center;
  /* Make sure section takes up full height minus header if applicable */
  min-height: calc(100vh - 7rem); 
}

.admin-layout {
  display: flex;
  height: 80vh;
  width: 90vw;
  margin: 4rem auto;
  max-width: 140rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 0.4rem 1.5rem rgba(0, 0, 0, 0.2);
  overflow: hidden; // Keep rounded corners clean
}

.sidebar {
  width: 25rem;
  flex-shrink: 0;
  background-color: #f4f5f7;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  
  .sidebar-title {
    padding: 0 2rem;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #333;
    font-weight: 700;
  }
}

.nav-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
}

.nav-item {
  padding: 1.5rem 2rem;
  font-size: 1.6rem;
  color: #555;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    background-color: #ebebeb;
    color: #333;
  }
  
  &.active {
    background-color: #e6f0fa;
    border-left-color: #0066cc;
    color: #0066cc;
  }
}

.sidebar-bottom {
  padding: 2rem;
  margin-top: auto;
  border-top: 1px solid #e0e0e0;
  
  .logout-btn {
    width: 100%;
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 4px;
    font-size: 1.6rem;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #c82333;
      border-color: transparent;
    }
  }
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

.settings-view {
  padding: 2rem;
  h2 {
    font-size: 2.4rem;
    margin-bottom: 1rem;
    color: #333;
  }
  p {
    font-size: 1.6rem;
    color: #666;
  }
}

.edit-view {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.collection-view {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>