<template>
  <div class="admin-list">
    <div class="list-title-bar">
      <h2>{{ title }}</h2>
      <button class="add-new-btn" @click="$emit('edit-item', {})">+ Add New</button>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="items.length === 0">No items found.</div>
    <div v-else>
      <div class="list-header">
        <span class="drag-handle-header">Reorder</span>
        <span class="item-title-header">Title / Identifier</span>
        <span class="actions-header">Actions</span>
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
            <span class="item-title">{{ getIdentifier(element) }}</span>
            <div class="post-tools">
              <button class="edit-btn" @click="$emit('edit-item', element)">Edit</button>
              <button class="delete-btn" @click="deleteItem(element)">Delete</button>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import { db } from '../../firebase/config'
import { collection, getDocs, query, orderBy, doc, writeBatch, deleteDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'

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

const { locale } = useI18n()
const items = ref([])
const loading = ref(true)

const loadItems = async () => {
  loading.value = true
  try {
    const q = query(collection(db, props.collectionName), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    const fetchedItems = []
    querySnapshot.forEach((doc) => {
      fetchedItems.push({ id: doc.id, ...doc.data() })
    })
    items.value = fetchedItems
  } catch (error) {
    console.error("Error loading items:", error)
  } finally {
    loading.value = false
  }
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

const deleteItem = async (item) => {
  if (confirm(`Are you sure you want to delete "${getIdentifier(item)}"?`)) {
    try {
      await deleteDoc(doc(db, props.collectionName, item.id))
      // Local update
      items.value = items.value.filter(i => i.id !== item.id)
      alert('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    }
  }
}

const onDragEnd = async () => {
  const confirmed = window.confirm('Czy chcesz zapisać nową kolejność?')
  if (!confirmed) {
    loadItems()
    return
  }

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
    alert('Kolejność została pomyślnie zaktualizowana!')
    console.log('Order updated successfully')
  } catch (error) {
    console.error('Error updating order:', error)
  }
}
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
      color: #333;
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
  
  .item-title {
    padding-left: 1rem;
    font-size: 1.6rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  
  .post-tools {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-right: 1rem;
  }
  
  .edit-btn {
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.4rem;
    transition: background-color 0.2s;
    white-space: nowrap;
    
    &:hover {
      background-color: #0052a3;
    }
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.4rem;
    transition: background-color 0.2s;
    white-space: nowrap;
    
    &:hover {
      background-color: #c82333;
    }
  }
}
</style>
