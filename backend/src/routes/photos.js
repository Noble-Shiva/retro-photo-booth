const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { db, bucket } = require('../config/firebase');
const { applyRetroFilter, createThumbnail } = require('../services/imageProcessor');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and process photo
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    const { filterType = 'vintage', groupId } = req.body;
    const photoId = uuidv4();

    // Apply retro filter
    const processedImage = await applyRetroFilter(req.file.buffer, filterType);
    const thumbnail = await createThumbnail(processedImage);

    // Upload to Firebase Storage
    const imagePath = `photos/${photoId}.webp`;
    const thumbPath = `thumbnails/${photoId}.webp`;

    const imageFile = bucket.file(imagePath);
    const thumbFile = bucket.file(thumbPath);

    await Promise.all([
      imageFile.save(processedImage, { contentType: 'image/webp' }),
      thumbFile.save(thumbnail, { contentType: 'image/webp' }),
    ]);

    // Make files publicly accessible
    await Promise.all([
      imageFile.makePublic(),
      thumbFile.makePublic(),
    ]);

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imagePath}`;
    const thumbUrl = `https://storage.googleapis.com/${bucket.name}/${thumbPath}`;

    // Save metadata to Firestore
    const photoData = {
      id: photoId,
      imageUrl,
      thumbUrl,
      filterType,
      groupId: groupId || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection('photos').doc(photoId).set(photoData);

    // If part of a group, add to group's photos
    if (groupId) {
      await db.collection('groups').doc(groupId).update({
        photoIds: require('firebase-admin').firestore.FieldValue.arrayUnion(photoId),
        updatedAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      photo: photoData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process photo' });
  }
});

// Get single photo
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('photos').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(doc.data());
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: 'Failed to get photo' });
  }
});

// Get user's photos (without group)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('photos')
      .where('groupId', '==', null)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const photos = snapshot.docs.map(doc => doc.data());
    res.json({ photos });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Failed to get photos' });
  }
});

module.exports = router;
