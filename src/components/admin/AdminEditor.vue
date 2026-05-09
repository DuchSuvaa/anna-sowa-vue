<template>
  <div class="admin-editor">
    <div class="editor-header">
      <button class="back-btn" @click="goBack">
        <span class="arrow">←</span> {{ $t('admin.back') }}
      </button>
      <h2>{{ $t('admin.editing') }}: {{ item.title || item.name || 'Post' }}</h2>
    </div>

    <div class="editor-content">
      <!-- Read-only Timestamp Display -->
      <div class="meta-info" v-if="item.timestamp">
        <p class="timestamp">{{ $t('admin.date-added') }}: {{ store.formatDate(item.timestamp) }}</p>
      </div>

      <AdminForm 
        v-if="currentSchema"
        :schema="currentSchema"
        v-model="editData"
        :errors="errors"
        :saving="saving"
        @submit="saveChanges"
        @cancel="goBack"
        @validate="validateField"
      />
      
      <div v-else class="no-schema">
        <p>No schema defined for this collection type.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'
import { db } from '../../firebase/config'
import { doc, updateDoc, collection, setDoc } from 'firebase/firestore'
import AdminForm from './AdminForm.vue'

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
const store = useStore()
const saving = ref(false)
const editData = ref({})
let originalDataString = ''

// Definition of form fields per collection
const schemas = computed(() => ({
  biography: [
    { key: 'title', label: t('admin.fields.identifier'), type: 'text', required: true, help: t('admin.fields.identifier-help') },
    { key: 'en.header', label: `${t('admin.fields.header')} (EN)`, type: 'text', required: true },
    { key: 'pl.header', label: `${t('admin.fields.header')} (PL)`, type: 'text', required: true },
    { key: 'en.text', label: `${t('admin.fields.content')} (EN)`, type: 'textarea', required: true },
    { key: 'pl.text', label: `${t('admin.fields.content')} (PL)`, type: 'textarea', required: true },
  ],
  compositions: [
    { key: 'title', label: t('admin.fields.identifier'), type: 'text', required: true, help: t('admin.fields.identifier-help') },
    { key: 'name.en', label: `${t('admin.fields.name')} (EN)`, type: 'text', required: true },
    { key: 'name.pl', label: `${t('admin.fields.name')} (PL)`, type: 'text', required: true },
    { key: 'year', label: t('admin.fields.year'), type: 'text', pattern: 'number' },
    { key: 'instrumentation.en', label: `${t('admin.fields.instrumentation')} (EN)`, type: 'text' },
    { key: 'instrumentation.pl', label: `${t('admin.fields.instrumentation')} (PL)`, type: 'text' },
    { key: 'type', label: t('admin.fields.type'), type: 'select', options: ['Orchestral', 'Chamber', 'Solo', 'Installations', 'Dance', 'Children'], required: true },
  ],
  news: [
    { key: 'title', label: t('admin.fields.identifier'), type: 'text', required: true, help: t('admin.fields.identifier-help') },
    { key: 'time.en', label: `${t('admin.fields.time')} (EN)`, type: 'text' },
    { key: 'time.pl', label: `${t('admin.fields.time')} (PL)`, type: 'text' },
    { key: 'venue.en', label: `${t('admin.fields.venue')} (EN)`, type: 'text' },
    { key: 'venue.pl', label: `${t('admin.fields.venue')} (PL)`, type: 'text' },
    { key: 'description.en', label: `${t('admin.fields.description')} (EN)`, type: 'textarea', required: true },
    { key: 'description.pl', label: `${t('admin.fields.description')} (PL)`, type: 'textarea', required: true },
    { key: 'performed.en', label: `${t('admin.fields.performed')} (EN)`, type: 'textarea' },
    { key: 'performed.pl', label: `${t('admin.fields.performed')} (PL)`, type: 'textarea' },
  ],
  press: [
    { key: 'title', label: t('admin.fields.identifier'), type: 'text', required: true, help: t('admin.fields.identifier-help') },
    { key: 'mediumText.en', label: `${t('admin.fields.mediumText')} (EN)`, type: 'text', required: true },
    { key: 'mediumText.pl', label: `${t('admin.fields.mediumText')} (PL)`, type: 'text', required: true },
    { key: 'mediumLink', label: t('admin.fields.link'), type: 'text', pattern: 'url' }
  ],
  multimedia: [
    { key: 'title', label: t('admin.fields.identifier'), type: 'text', required: true, help: t('admin.fields.identifier-help') },
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
  const data = cloneDeep(props.item)
  
  // Ensure title/identifier exists for all collections
  if (!data.title) {
    if (props.collectionName === 'biography') data.title = getNested(data, 'en.header') || getNested(data, 'en.title')
    else if (props.collectionName === 'compositions') data.title = getNested(data, 'name.en')
    else if (props.collectionName === 'news') data.title = getNested(data, 'description.en')
    else if (props.collectionName === 'press') data.title = getNested(data, 'mediumText.en')
    else if (props.collectionName === 'multimedia') data.title = data.name
  }

  editData.value = data
  originalDataString = JSON.stringify(editData.value)
})

const getNested = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || ''
}

const errors = ref({})

const validateField = (field) => {
  const value = getNested(editData.value, field.key)
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

// Auto-detect media-type for multimedia
watch(() => editData.value.link, (newLink) => {
  if (props.collectionName === 'multimedia' && newLink) {
    const v = newLink.toLowerCase()
    if (v.includes('vimeo.com') || v.includes('youtube.com') || v.includes('youtu.be')) {
      editData.value['media-type'] = 'video'
    } else if (v.includes('/audio/') || v.includes('.mp3') || v.includes('.wav')) {
      editData.value['media-type'] = 'audio'
    }
  }
})

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
    if (!validateField(field)) {
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
  color: #666;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  text-decoration: none;
  transition: color 0.2s;
  
  .arrow {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: #333;
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

.no-schema {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.6rem;
}
</style>
