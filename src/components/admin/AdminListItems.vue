<template>
  <div class="admin-list">
    <div class="list-title-bar">
      <h2>{{ title }}</h2>
      <div class="title-bar-actions">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDir === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
        <button class="add-new-btn" @click="$emit('edit-item', {})">+ {{ $t('admin.add-new') }}</button>
      </div>
    </div>
    <div v-if="loading">{{ $t('admin.loading') }}</div>
    <div v-else-if="items.length === 0">{{ $t('admin.no-items') }}</div>
    <div v-else>
      <div class="list-header">
        <span class="drag-handle-header">{{ $t('admin.move') }}</span>
        <span class="item-title-header">{{ $t('admin.title') }}</span>
        <span class="actions-header">{{ $t('admin.actions') }}</span>
      </div>
      <draggable
        v-model="items"
        group="items"
        @end="onDragEnd"
        item-key="id"
        class="draggable-list"
        handle=".drag-handle"
      >
        <template #item="{ element }">
          <div class="list-item">
            <span class="drag-handle">☰</span>
            <div class="item-content">
              <span class="item-title">
                {{ getIdentifier(element) }}
                <span v-if="collectionName === 'galleries'" class="photo-count">
                  ({{ element.photos?.length || 0 }})
                </span>
              </span>
              <div class="item-meta">
                <!-- Compositions specific info -->
                <template v-if="collectionName === 'compositions'">
                  <span class="meta-tag">{{ element.year }}</span>
                  <span class="meta-tag type-tag">{{ element.type }}</span>
                </template>

                <!-- News specific info -->
                <template v-else-if="collectionName === 'news'">
                  <span class="meta-tag">{{ element.time?.en }}</span>
                </template>

                <!-- Multimedia specific info -->
                <template v-else-if="collectionName === 'multimedia'">
                  <span class="meta-tag">{{ element.year }}</span>
                  <span class="meta-tag media-tag">{{ element['media-type'] }}</span>
                  <span class="meta-tag type-tag">{{ element['music-type'] }}</span>
                </template>
              </div>
            </div>
            <div class="post-tools">
              <EditIcon @click="$emit('edit-item', element)" />
              <DeleteIcon @click="deleteItem(element)" />
            </div>
          </div>
        </template>
      </draggable>
    </div>
    
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmText="confirmModalConfirmText"
      :cancelText="confirmModalCancelText"
      @confirm="onConfirmAction"
      @cancel="onCancelAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import { db } from '../../firebase/config'
import { collection, getDocs, query, orderBy, doc, writeBatch, deleteDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps({
  collectionName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['edit-item'])

const { locale, t } = useI18n()
const store = useStore()
const items = ref([])
const loading = ref(true)
const sortDir = ref('asc')

const loadItems = async () => {
  loading.value = true
  try {
    const q = query(collection(db, props.collectionName), orderBy('order', sortDir.value))
    const querySnapshot = await getDocs(q)
    const fetchedItems = []
    querySnapshot.forEach((doc) => {
      fetchedItems.push({ id: doc.id, ...doc.data() })
    })
    items.value = fetchedItems
  } catch (error) {
    store.setError("Error loading items: " + error.message)
    console.error("Error loading items:", error)
  } finally {
    loading.value = false
  }
}

const toggleSort = () => {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  loadItems()
}

onMounted(() => {
  loadItems()
})

watch(() => props.collectionName, () => {
  loadItems()
})

const getIdentifier = (item) => {
  if (item.title) return item.title
  if (item.name) {
    if (typeof item.name === 'string') return item.name
    return item.name.en || item.name.pl || Object.values(item.name)[0]
  }
  return item.id
}

const showConfirmModal = ref(false)
const confirmModalMessage = ref('')
const confirmModalTitle = ref('')
const confirmModalConfirmText = ref('')
const confirmModalCancelText = ref('')
const onConfirmAction = ref(null)
const onCancelAction = ref(null)

const showConfirm = (title, message, onConfirm, onCancel = null, confirmText = '', cancelText = '') => {
  confirmModalTitle.value = title
  confirmModalMessage.value = message
  confirmModalConfirmText.value = confirmText
  confirmModalCancelText.value = cancelText
  onConfirmAction.value = () => {
    onConfirm()
    showConfirmModal.value = false
  }
  onCancelAction.value = () => {
    if (onCancel) onCancel()
    showConfirmModal.value = false
  }
  showConfirmModal.value = true
}

const deleteItem = (item) => {
  showConfirm(
    t('admin.delete-confirm') + '?',
    t('admin.delete-confirm') + ` "${getIdentifier(item)}"?`,
    async () => {
      try {
        await deleteDoc(doc(db, props.collectionName, item.id))
        // Local update
        items.value = items.value.filter(i => i.id !== item.id)
        store.setNotification(t('admin.item-deleted'))
      } catch (error) {
        console.error('Error deleting item:', error)
        store.setError('Error deleting item')
      }
    },
    null,
    t('admin.remove') // or any translated text you have for 'Delete'/'Remove'
  )
}

const onDragEnd = () => {
  showConfirm(
    t('admin.move'),
    t('admin.order-question'),
    async () => {
      try {
        const batch = writeBatch(db)
        
        // Update the 'order' field for each item based on its new index in the array
        items.value.forEach((item, index) => {
          const docRef = doc(db, props.collectionName, item.id)
          batch.update(docRef, { order: index })
          // Update local state as well
          item.order = index
        })
        
        await batch.commit()
        store.setNotification(t('admin.order-success'))
      } catch (error) {
        console.error('Error updating order:', error)
        store.setError('Error updating order')
      }
    },
    () => {
      loadItems()
    }
  )
}

defineExpose({ reload: loadItems })
</script>

<style lang="scss" scoped>
.admin-list {
  padding: 2rem;
    
  .list-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h2 {
      margin: 0;
      font-size: 2.4rem;
    }

    .title-bar-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sort-btn {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 1rem 1.6rem;
      font-size: 1.4rem;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #5a6268;
      }
    }

    .add-new-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.6rem;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #218838;
      }
    }
  }
}

.list-header {
  display: grid;
  grid-template-columns: 6rem 1fr auto;
  align-items: center;
  padding: 1rem;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  margin-bottom: 1rem;
  color: #555;
  
  .drag-handle-header {
    text-align: center;
  }
  
  .item-title-header {
    padding-left: 1rem;
  }

  .actions-header {
    text-align: right;
    padding-right: 1rem;
  }
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: grid;
  grid-template-columns: 6rem 1fr auto;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    .post-tools {
      opacity: 1;
    }
  }
  
  .drag-handle {
    cursor: grab;
    text-align: center;
    font-size: 1.5rem;
    color: #888;
    
    &:active {
      cursor: grabbing;
    }
  }

  .item-content {
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
    overflow: hidden;
  }
  
  .item-title {
    font-size: 1.6rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;

    .photo-count {
      font-size: 1.3rem;
      color: #888;
      font-weight: 400;
      margin-left: 0.5rem;
    }
  }

  .item-meta {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.4rem;
    flex-wrap: wrap;

    .meta-tag {
      font-size: 1.1rem;
      padding: 0.2rem 0.6rem;
      background-color: #f0f0f0;
      color: #666;
      border-radius: 3px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
      max-width: 25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.media-tag {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      &.type-tag {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }

      &.venue-tag {
        background-color: #e8f5e9;
        color: #2e7d32;
        text-transform: none;
      }
    }
  }  
  .post-tools {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-right: 1rem;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;

    svg {
      font-size: 1.7rem; 
      &:hover {
        cursor: pointer;
        color: #666;
      }
    }
  }
}

/* --- Responsive Styles (RWD) --- */
@media (max-width: 768px) {
  .admin-list {
    padding: 1rem;
    
    .list-title-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
      
      .title-bar-actions {
        width: 100%;
        justify-content: space-between;
      }
      
      .sort-btn, .add-new-btn {
        flex: 1;
        text-align: center;
      }
    }
  }

  .list-header {
    grid-template-columns: 4rem 1fr auto;
    font-size: 1.3rem;
    padding: 0.8rem 0.5rem;
    
    .item-title-header {
      padding-left: 0.5rem;
    }
  }

  .list-item {
    grid-template-columns: 4rem 1fr auto;
    padding: 1.2rem 0.5rem;

    .item-content {
      padding-left: 0.5rem;
    }
    
    .item-title {
      font-size: 1.4rem;
      padding-left: 0;
    }
    
    .post-tools {
      opacity: 1; /* Always visible on mobile, no hover needed */
      padding-right: 0.5rem;
      
      svg {
        font-size: 2rem; /* Larger touch targets */
        padding: 0.5rem; /* More spacing for fat fingers */
      }
    }
  }
}
</style>
