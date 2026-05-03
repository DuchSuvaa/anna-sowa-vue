<template>
  <div class="admin-editor">
    <div class="editor-header">
      <button class="back-btn" @click="goBack">
        <span class="arrow">←</span> {{ $t('admin.back-to-list') }}
      </button>
      <h2>{{ $t('admin.editing') }}: {{ item.title || item.name || 'Post' }}</h2>
    </div>

    <div class="editor-content">
      <!-- Read-only Timestamp Display -->
      <div class="meta-info" v-if="item.timestamp">
        <p class="timestamp">{{ $t('admin.date-added') }}: {{ formatDate(item.timestamp) }}</p>
      </div>

      <form @submit.prevent="saveChanges" class="edit-form" v-if="currentSchema">
        <div class="form-group" v-for="field in currentSchema" :key="field.key">
          <label>{{ field.label }}</label>
          
          <!-- Text Input -->
          <input 
            v-if="field.type === 'text'" 
            type="text" 
            :value="getNested(editData, field.key)" 
            @input="handleInput(field, $event.target.value)"
            @blur="validateField(field, getNested(editData, field.key))"
            class="form-control"
            :class="{ 'is-invalid': errors[field.key] }"
          />
          
          <!-- Textarea -->
          <textarea 
            v-else-if="field.type === 'textarea'" 
            :value="getNested(editData, field.key)" 
            @input="handleInput(field, $event.target.value)"
            @blur="validateField(field, getNested(editData, field.key))"
            class="form-control"
            :class="{ 'is-invalid': errors[field.key] }"
            rows="5"
          ></textarea>

          <!-- Select Input -->
          <select 
            v-else-if="field.type === 'select'" 
            :value="getNested(editData, field.key)" 
            @change="handleInput(field, $event.target.value)"
            @blur="validateField(field, getNested(editData, field.key))"
            class="form-control"
            :class="{ 'is-invalid': errors[field.key] }"
          >
            <option value="" disabled>{{ t('admin.select-option') }}</option>
            <option v-for="opt in field.options" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>

          <!-- Text Array (e.g. bio paragraphs) -->
          <div v-else-if="field.type === 'text-array'" class="array-container">
            <div v-for="(paragraph, index) in getArray(editData, field.key)" :key="index" class="array-item">
              <textarea 
                :value="paragraph" 
                @input="updateArrayItem(field.key, index, $event.target.value)"
                class="form-control"
                rows="4"
              ></textarea>
              <button type="button" class="action-btn remove-btn" @click="removeArrayItem(field.key, index)">{{ $t('admin.remove-paragraph') }}</button>
            </div>
            <button type="button" class="action-btn add-btn" @click="addArrayItem(field.key)">+ {{ $t('admin.add-another') }}</button>
          </div>

          <span v-if="errors[field.key]" class="error-msg">{{ errors[field.key] }}</span>
        </div>

        <div class="editor-actions">
          <button type="button" class="cancel-btn" @click="goBack">{{ $t('admin.cancel') }}</button>
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? $t('admin.saving') : $t('admin.save-changes') }}
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
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const saving = ref(false)
const editData = ref({})
let originalDataString = ''

// Definition of form fields per collection
const schemas = computed(() => ({
  biography: [
    { key: 'en.title', label: `${t('admin.fields.title')} (EN)`, type: 'text', required: true },
    { key: 'pl.title', label: `${t('admin.fields.title')} (PL)`, type: 'text', required: true },
    { key: 'en.text', label: `${t('admin.fields.content')} (EN)`, type: 'text-array', required: true },
    { key: 'pl.text', label: `${t('admin.fields.content')} (PL)`, type: 'text-array', required: true },
  ],
  compositions: [
    { key: 'name.en', label: `${t('admin.fields.name')} (EN)`, type: 'text', required: true },
    { key: 'name.pl', label: `${t('admin.fields.name')} (PL)`, type: 'text', required: true },
    { key: 'year', label: t('admin.fields.year'), type: 'text', pattern: 'number' },
    { key: 'instrumentation.en', label: `${t('admin.fields.instrumentation')} (EN)`, type: 'text' },
    { key: 'instrumentation.pl', label: `${t('admin.fields.instrumentation')} (PL)`, type: 'text' },
    { key: 'type', label: t('admin.fields.type'), type: 'select', options: ['Orchestral', 'Chamber', 'Solo', 'Installations', 'Dance', 'Children'], required: true },
  ],
  news: [
    { key: 'time.en', label: `${t('admin.fields.time')} (EN)`, type: 'text' },
    { key: 'time.pl', label: `${t('admin.fields.time')} (PL)`, type: 'text' },
    { key: 'venue.en', label: `${t('admin.fields.venue')} (EN)`, type: 'text' },
    { key: 'venue.pl', label: `${t('admin.fields.venue')} (PL)`, type: 'text' },
    { key: 'description.en', label: `${t('admin.fields.description')} (EN)`, type: 'textarea', required: true },
    { key: 'description.pl', label: `${t('admin.fields.description')} (PL)`, type: 'textarea', required: true },
    { key: 'performed.en', label: `${t('admin.fields.performed')} (EN)`, type: 'textarea' },
    { key: 'performed.pl', label: `${t('admin.fields.performed')} (PL)`, type: 'textarea' },
  ],
  media: [
    { key: 'mediumText.en', label: `${t('admin.fields.mediumText')} (EN)`, type: 'text', required: true },
    { key: 'mediumText.pl', label: `${t('admin.fields.mediumText')} (PL)`, type: 'text', required: true },
    { key: 'mediumLink', label: t('admin.fields.link'), type: 'text', pattern: 'url' }
  ],
  works: [
    { key: 'name', label: t('admin.fields.name'), type: 'text', required: true },
    { key: 'year', label: t('admin.fields.year'), type: 'text', pattern: 'number' },
    { key: 'media-type', label: t('admin.fields.media-type'), type: 'select', options: ['audio', 'video'], required: true },
    { key: 'music-type', label: t('admin.fields.music-type'), type: 'select', options: ['Chamber', 'Installation', 'Orchestral'], required: true },
    { key: 'link', label: t('admin.fields.link'), type: 'text', pattern: 'url' },
    { key: 'info', label: t('admin.fields.info'), type: 'textarea' },
    { key: 'description', label: t('admin.fields.description'), type: 'textarea' },
  ]
}))

const currentSchema = computed(() => schemas.value[props.collectionName])

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

const errors = ref({})

const validateField = (field, value) => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === ''))) {
    errors.value[field.key] = t('admin.validation.required')
    return false
  }
  
  if (value && field.pattern === 'url') {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
    if (!urlPattern.test(value)) {
      errors.value[field.key] = t('admin.validation.invalid-url')
      return false
    }
  }

  if (value && field.pattern === 'number') {
    if (isNaN(value)) {
      errors.value[field.key] = t('admin.validation.invalid-number')
      return false
    }
  }

  delete errors.value[field.key]
  return true
}

const handleInput = (field, value) => {
  setNested(editData.value, field.key, value)
  
  // Auto-detect media-type for works
  if (props.collectionName === 'works' && field.key === 'link') {
    const v = value.toLowerCase()
    if (v.includes('vimeo.com') || v.includes('youtube.com') || v.includes('youtu.be')) {
      setNested(editData.value, 'media-type', 'video')
    } else if (v.includes('/audio/') || v.includes('.mp3') || v.includes('.wav')) {
      setNested(editData.value, 'media-type', 'audio')
    }
  }

  if (errors.value[field.key]) {
    validateField(field, value)
  }
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
    if (!confirm(t('admin.unsaved-changes'))) {
      return
    }
  }
  emit('back')
}

const saveChanges = async () => {
  // Validate all fields
  let isValid = true
  currentSchema.value.forEach(field => {
    const value = getNested(editData.value, field.key)
    if (!validateField(field, value)) {
      isValid = false
    }
  })

  if (!isValid) {
    alert(t('admin.save-error') + ' ' + Object.values(errors.value)[0])
    return
  }

  saving.value = true
  try {
    let docRef
    const isNew = !props.item.id
    
    if (isNew) {
      docRef = doc(collection(db, props.collectionName))
      editData.value.id = docRef.id
      editData.value.order = -1      // appear at top (list sorted asc)
      editData.value.timestamp = new Date()
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
    
    alert(t('admin.save-success'))
    emit('back')
  } catch (error) {
    console.error("Error saving document: ", error)
    alert(t('admin.save-error'))
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

  &.is-invalid {
    border-color: #dc3545;
    &:focus {
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
  }
}

.error-msg {
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: -0.4rem;
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
