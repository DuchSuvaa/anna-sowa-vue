<template>
  <div class="admin-editor">
    <div class="editor-header">
      <button class="back-btn" @click="goBack">
        <span class="arrow">←</span> Back to list
      </button>
      <h2>Editing Gallery: {{ editData.title || editData.name?.en || 'New Gallery' }}</h2>
    </div>

    <div class="editor-content">
      <form @submit.prevent="saveChanges" class="edit-form">
        <div class="form-group">
          <label>Title / Identifier</label>
          <input type="text" v-model="editData.title" class="form-control" required />
          <p class="help-text">Internal identifier, used for sorting and admin display.</p>
        </div>
        
        <div class="form-group">
          <label>Name (EN)</label>
          <input type="text" v-model="editData.name.en" class="form-control" required />
        </div>

        <div class="form-group">
          <label>Name (PL)</label>
          <input type="text" v-model="editData.name.pl" class="form-control" required />
        </div>

        <div class="gallery-manager">
          <h3>Photos ({{ editData.photos.length }})</h3>
          
          <button type="button" class="action-btn add-btn" @click="openWidget">
            Upload / Add Photos
          </button>

          <draggable
            v-model="editData.photos"
            group="photos"
            item-key="public_id"
            class="photo-grid"
            handle=".drag-handle"
          >
            <template #item="{ element, index }">
              <div class="photo-item">
                <span class="drag-handle">☰</span>
                <img :src="getThumbnail(element.public_id)" :alt="'Photo ' + index" />
                <div class="photo-info">
                  <span>{{ element.width }}x{{ element.height }}</span>
                  <button type="button" class="remove-btn" @click="removePhoto(index)">Remove</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <div class="editor-actions">
          <button type="button" class="cancel-btn" @click="goBack">Cancel</button>
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Gallery' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { db } from '../../firebase/config'
import { doc, updateDoc, setDoc, collection } from 'firebase/firestore'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])

const saving = ref(false)
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const editData = ref({
  id: '',
  title: '',
  name: { en: '', pl: '' },
  order: 0,
  photos: []
})

let originalDataString = ''

onMounted(() => {
  // Initialize from props.item but ensure structure exists
  const baseData = JSON.parse(JSON.stringify(props.item))
  if (!baseData.name) baseData.name = { en: '', pl: '' }
  if (!baseData.photos) baseData.photos = []
  
  editData.value = baseData
  originalDataString = JSON.stringify(editData.value)
})

// Cloudinary Widget Initialization
let widget = null
const openWidget = () => {
  if (!widget) {
    widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url'],
        multiple: true,
        maxFiles: 50
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info)
          editData.value.photos.push({
            public_id: result.info.public_id,
            url: result.info.secure_url,
            width: result.info.width,
            height: result.info.height
          })
        }
      }
    )
  }
  widget.open()
}

const getThumbnail = (publicId) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,w_200,h_200,g_face/${publicId}`
}

const removePhoto = (index) => {
  if(confirm("Are you sure you want to remove this photo from the gallery?")) {
    editData.value.photos.splice(index, 1)
  }
}

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
    if (editData.value.id) {
      docRef = doc(db, 'galleries', editData.value.id)
    } else {
      docRef = doc(collection(db, 'galleries'))
      editData.value.id = docRef.id // ensure new document has ID
      // Set to high order so it goes to bottom by default
      editData.value.order = 999 
    }
    
    const payload = { ...editData.value }
    delete payload.id // don't store id inside the document fields if we can, though sometimes okay
    
    // Fallback title
    if(!payload.title) payload.title = payload.name.en

    if (props.item.id) {
      await updateDoc(docRef, payload)
    } else {
      await setDoc(docRef, payload)
    }
    
    // Update local state to avoid reload issues
    Object.assign(props.item, editData.value)
    originalDataString = JSON.stringify(editData.value)
    
    alert('Gallery saved successfully!')
    emit('back')
  } catch (error) {
    console.error("Error saving document: ", error)
    alert("There was an error saving the gallery.")
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
  
  .help-text {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
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

.gallery-manager {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    font-size: 1.8rem;
    color: #333;
  }
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.photo-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;

  .drag-handle {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: rgba(255,255,255,0.8);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    cursor: grab;
    z-index: 2;
  }

  img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
  }

  .photo-info {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    background: #f4f4f4;

    .remove-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.3rem 0.6rem;
      border-radius: 3px;
      cursor: pointer;
      font-size: 1.1rem;
      
      &:hover {
        background: #c82333;
      }
    }
  }
}

.action-btn {
  padding: 0.8rem 1.6rem;
  font-size: 1.4rem;
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
    margin-bottom: 1rem;
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
