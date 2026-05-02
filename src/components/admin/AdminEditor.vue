<template>
  <div class="admin-editor">
    <div class="editor-header">
      <button class="back-btn" @click="goBack">
        <span class="arrow">←</span> Back to list
      </button>
      <h2>Editing: {{ item.title || item.name || 'Post' }}</h2>
    </div>

    <div class="editor-content">
      <!-- Read-only Timestamp Display -->
      <div class="meta-info" v-if="item.timestamp">
        <p class="timestamp">Date added: {{ formatDate(item.timestamp) }}</p>
      </div>

      <form @submit.prevent="saveChanges" class="edit-form" v-if="currentSchema">
        <div class="form-group" v-for="field in currentSchema" :key="field.key">
          <label>{{ field.label }}</label>
          
          <!-- Text Input -->
          <input 
            v-if="field.type === 'text'" 
            type="text" 
            :value="getNested(editData, field.key)" 
            @input="setNested(editData, field.key, $event.target.value)"
            class="form-control"
          />
          
          <!-- Textarea -->
          <textarea 
            v-else-if="field.type === 'textarea'" 
            :value="getNested(editData, field.key)" 
            @input="setNested(editData, field.key, $event.target.value)"
            class="form-control"
            rows="5"
          ></textarea>

          <!-- Text Array (e.g. bio paragraphs) -->
          <div v-else-if="field.type === 'text-array'" class="array-container">
            <div v-for="(paragraph, index) in getArray(editData, field.key)" :key="index" class="array-item">
              <textarea 
                :value="paragraph" 
                @input="updateArrayItem(field.key, index, $event.target.value)"
                class="form-control"
                rows="4"
              ></textarea>
              <button type="button" class="action-btn remove-btn" @click="removeArrayItem(field.key, index)">Remove Paragraph</button>
            </div>
            <button type="button" class="action-btn add-btn" @click="addArrayItem(field.key)">+ Add another paragraph</button>
          </div>
        </div>

        <div class="editor-actions">
          <button type="button" class="cancel-btn" @click="goBack">Cancel</button>
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
      
      <div v-else class="no-schema">
        <p>No schema defined for this collection type.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../firebase/config'
import { doc, updateDoc, collection, setDoc } from 'firebase/firestore'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  collectionName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back'])

const saving = ref(false)
const editData = ref({})
let originalDataString = ''

// Definition of form fields per collection
const schemas = {
  biography: [
    { key: 'en.title', label: 'Title (EN)', type: 'text' },
    { key: 'pl.title', label: 'Title (PL)', type: 'text' },
    { key: 'en.text', label: 'Content Paragraphs (EN)', type: 'text-array' },
    { key: 'pl.text', label: 'Content Paragraphs (PL)', type: 'text-array' },
  ],
  compositions: [
    { key: 'name.en', label: 'Name (EN)', type: 'text' },
    { key: 'name.pl', label: 'Name (PL)', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'instrumentation.en', label: 'Instrumentation (EN)', type: 'text' },
    { key: 'instrumentation.pl', label: 'Instrumentation (PL)', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
  ],
  news: [
    { key: 'time.en', label: 'Time (EN)', type: 'text' },
    { key: 'time.pl', label: 'Time (PL)', type: 'text' },
    { key: 'venue.en', label: 'Venue (EN)', type: 'text' },
    { key: 'venue.pl', label: 'Venue (PL)', type: 'text' },
    { key: 'description.en', label: 'Description (EN)', type: 'textarea' },
    { key: 'description.pl', label: 'Description (PL)', type: 'textarea' },
    { key: 'performed.en', label: 'Performed By (EN)', type: 'textarea' },
    { key: 'performed.pl', label: 'Performed By (PL)', type: 'textarea' },
  ],
  media: [
    { key: 'mediumText.en', label: 'Medium Text (EN)', type: 'text' },
    { key: 'mediumText.pl', label: 'Medium Text (PL)', type: 'text' },
    { key: 'mediumLink', label: 'Link', type: 'text' }
  ],
  works: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'media-type', label: 'Media Type', type: 'text' },
    { key: 'music-type', label: 'Music Type', type: 'text' },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'info', label: 'Info', type: 'textarea' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ]
}

const currentSchema = computed(() => schemas[props.collectionName])

// Deep Clone to avoid mutating props directly
function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj && typeof obj === 'object' && obj.toDate) return obj // Firestore timestamp
  if (Array.isArray(obj)) return obj.map(cloneDeep)
  const cloned = {}
  for (const key in obj) {
    cloned[key] = cloneDeep(obj[key])
  }
  return cloned
}

onMounted(() => {
  editData.value = cloneDeep(props.item)
  originalDataString = JSON.stringify(editData.value)
})

const getNested = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || ''
}

const setNested = (obj, path, value) => {
  const parts = path.split('.')
  const last = parts.pop()
  let current = obj
  for (const p of parts) {
    if (typeof current[p] !== 'object' || current[p] === null) {
      current[p] = {}
    }
    current = current[p]
  }
  current[last] = value
}

// Array handlers
const getArray = (obj, path) => {
  const arr = getNested(obj, path)
  return Array.isArray(arr) ? arr : []
}

const updateArrayItem = (path, index, value) => {
  const arr = [...getArray(editData.value, path)]
  arr[index] = value
  setNested(editData.value, path, arr)
}

const addArrayItem = (path) => {
  const arr = [...getArray(editData.value, path)]
  arr.push('')
  setNested(editData.value, path, arr)
}

const removeArrayItem = (path, index) => {
  const arr = [...getArray(editData.value, path)]
  arr.splice(index, 1)
  setNested(editData.value, path, arr)
}

// Date formatter
const formatDate = (ts) => {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts._seconds ? ts._seconds * 1000 : ts)
  return date.toLocaleString()
}

// Actions
const goBack = () => {
  const isDirty = JSON.stringify(editData.value) !== originalDataString
  if (isDirty) {
    if (!confirm('You have unsaved changes. Are you sure you want to discard them and go back?')) {
      return
    }
  }
  emit('back')
}

const saveChanges = async () => {
  saving.value = true
  try {
    let docRef
    const isNew = !props.item.id
    
    if (isNew) {
      docRef = doc(collection(db, props.collectionName))
      editData.value.id = docRef.id
      editData.value.order = 999 // Default to end of list
    } else {
      docRef = doc(db, props.collectionName, props.item.id)
    }
    
    const payload = { ...editData.value }
    delete payload.id
    
    // We update the universal title too so Admin panel stays in sync!
    if (props.collectionName === 'biography') {
        payload.title = getNested(payload, 'en.title') || payload.title
    } else if (props.collectionName === 'compositions') {
        payload.title = getNested(payload, 'name.en') || payload.title
    } else if (props.collectionName === 'news') {
        payload.title = getNested(payload, 'description.en') || payload.title
    } else if (props.collectionName === 'media') {
        payload.title = getNested(payload, 'mediumText.en') || payload.title
    } else if (props.collectionName === 'works') {
        payload.title = payload.name || payload.title
    }

    if (isNew) {
      await setDoc(docRef, payload)
    } else {
      await updateDoc(docRef, payload)
    }
    
    // Update local state to avoid reload issues
    Object.assign(props.item, editData.value)
    originalDataString = JSON.stringify(editData.value)
    
    alert('Changes saved successfully!')
    emit('back')
  } catch (error) {
    console.error("Error saving document: ", error)
    alert("There was an error saving changes.")
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-editor {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;

  h2 {
    margin-top: 1rem;
    font-size: 2.2rem;
    color: #222;
  }
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: #0066cc;
  font-size: 1.6rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  
  .arrow {
    margin-right: 0.5rem;
    font-size: 2rem;
  }
  
  &:hover {
    color: #004999;
    text-decoration: underline;
  }
}

.meta-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #aaa;
  
  .timestamp {
    color: #777;
    font-style: italic;
    font-size: 1.4rem;
    margin: 0;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  label {
    font-weight: 600;
    color: #444;
    font-size: 1.5rem;
  }
}

.form-control {
  width: 100%;
  padding: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1.5rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
}

textarea.form-control {
  resize: vertical;
}

.array-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px dashed #ccc;
}

.array-item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.action-btn {
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  font-size: 1.3rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.add-btn {
    background-color: #28a745;
    color: white;
  }
  
  &.remove-btn {
    background-color: #dc3545;
    color: white;
  }
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  
  button {
    padding: 1.2rem 2.4rem;
    font-size: 1.6rem;
    font-weight: bold;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: transform 0.1s, background-color 0.2s;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .cancel-btn {
    background-color: #e0e0e0;
    color: #333;
    
    &:hover {
      background-color: #ccc;
    }
  }
  
  .save-btn {
    background-color: #0066cc;
    color: white;
    
    &:hover {
      background-color: #0052a3;
    }
    
    &:disabled {
      background-color: #80b3e6;
      cursor: not-allowed;
    }
  }
}
</style>
