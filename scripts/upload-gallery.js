import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const serviceAccount = require('../firebase.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const cloudName = 'dv8vmcin0';
const uploadPreset = 'ananasowa';
const photosDir = path.join(process.cwd(), 'photos');

const run = async () => {
  console.log('Starting upload process...');
  
  // 1. Read files
  const files = fs.readdirSync(photosDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  
  if (files.length === 0) {
    console.log('No photos found in /photos directory.');
    return;
  }
  
  const uploadedPhotos = [];
  
  // 2. Upload to Cloudinary sequentially
  for (const filename of files) {
    const filePath = path.join(photosDir, filename);
    const fileData = fs.readFileSync(filePath);
    
    // Cloudinary supports data URI base64 uploads
    const mimeType = filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    const base64Data = `data:${mimeType};base64,${fileData.toString('base64')}`;
    
    console.log(`Uploading ${filename}...`);
    
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', uploadPreset);
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.error) {
        console.error(`Error uploading ${filename}:`, result.error.message);
        continue;
      }
      
      console.log(`  -> Success! Public ID: ${result.public_id}`);
      
      uploadedPhotos.push({
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      });
      
    } catch (err) {
      console.error(`Fetch error for ${filename}:`, err);
    }
  }
  
  // 3. Create Firestore document
  if (uploadedPhotos.length > 0) {
    console.log(`Creating gallery in Firestore with ${uploadedPhotos.length} photos...`);
    try {
      const galleryData = {
        title: 'Portraits',
        name: {
          en: 'Portraits',
          pl: 'Portrety'
        },
        order: 1,
        photos: uploadedPhotos
      };
      
      const docRef = await db.collection('galleries').add(galleryData);
      console.log(`Successfully created gallery "Portrety" with ID: ${docRef.id}`);
    } catch (err) {
      console.error('Error creating Firestore document:', err);
    }
  } else {
    console.log('No photos were successfully uploaded. Firestore document not created.');
  }
}

run();
