const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db, bucket } = require('../config/firebase');
const { generateQRCode, generateQRBuffer } = require('../services/qrService');

const router = express.Router();

// Create a new group
router.post('/', async (req, res) => {
  try {
    const { name, adminName } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const groupId = uuidv4();
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate QR code for joining
    const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${groupId}`;
    const qrDataUrl = await generateQRCode(joinUrl);

    // Save QR code to storage
    const qrBuffer = await generateQRBuffer(joinUrl);
    const qrPath = `qrcodes/${groupId}.png`;
    const qrFile = bucket.file(qrPath);
    await qrFile.save(qrBuffer, { contentType: 'image/png' });
    await qrFile.makePublic();
    const qrUrl = `https://storage.googleapis.com/${bucket.name}/${qrPath}`;

    const groupData = {
      id: groupId,
      name,
      adminName: adminName || 'Admin',
      joinCode,
      joinUrl,
      qrCode: qrDataUrl,
      qrUrl,
      photoIds: [],
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('groups').doc(groupId).set(groupData);

    res.json({
      success: true,
      group: groupData,
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get group details
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('groups').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = doc.data();

    // Fetch photos for this group
    if (groupData.photoIds && groupData.photoIds.length > 0) {
      const photoDocs = await Promise.all(
        groupData.photoIds.map(id => db.collection('photos').doc(id).get())
      );
      groupData.photos = photoDocs
        .filter(doc => doc.exists)
        .map(doc => doc.data());
    } else {
      groupData.photos = [];
    }

    res.json(groupData);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to get group' });
  }
});

// Join a group
router.post('/:id/join', async (req, res) => {
  try {
    const { memberName } = req.body;
    const groupId = req.params.id;

    const doc = await db.collection('groups').doc(groupId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const memberId = uuidv4();
    const member = {
      id: memberId,
      name: memberName || 'Guest',
      joinedAt: new Date().toISOString(),
    };

    await db.collection('groups').doc(groupId).update({
      members: require('firebase-admin').firestore.FieldValue.arrayUnion(member),
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      memberId,
      group: doc.data(),
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Get QR code for group
router.get('/:id/qr', async (req, res) => {
  try {
    const doc = await db.collection('groups').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { qrCode, qrUrl, joinUrl } = doc.data();
    res.json({ qrCode, qrUrl, joinUrl });
  } catch (error) {
    console.error('Get QR error:', error);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

// List all groups (for admin)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('groups')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const groups = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        name: data.name,
        memberCount: data.members?.length || 0,
        photoCount: data.photoIds?.length || 0,
        createdAt: data.createdAt,
      };
    });

    res.json({ groups });
  } catch (error) {
    console.error('List groups error:', error);
    res.status(500).json({ error: 'Failed to list groups' });
  }
});

module.exports = router;
