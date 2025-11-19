const admin = require('firebase-admin');

let db, bucket;
let mockMode = false;

// Mock storage for demo mode
const mockData = {
  photos: [],
  groups: [],
};

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-project-id') {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    db = admin.firestore();
    bucket = admin.storage().bucket();
    console.log('Firebase initialized successfully');
  } else {
    throw new Error('No Firebase config');
  }
} catch (error) {
  console.log('Running in MOCK MODE - no Firebase configured');
  mockMode = true;

  // Mock Firestore-like interface
  db = {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => {
          const item = mockData[name]?.find(i => i.id === id);
          return {
            exists: !!item,
            data: () => item,
          };
        },
        set: async (data) => {
          const existing = mockData[name]?.findIndex(i => i.id === data.id);
          if (existing >= 0) {
            mockData[name][existing] = data;
          } else {
            mockData[name] = mockData[name] || [];
            mockData[name].push(data);
          }
        },
        update: async (data) => {
          const item = mockData[name]?.find(i => i.id === id);
          if (item) Object.assign(item, data);
        },
      }),
      where: () => ({
        orderBy: () => ({
          limit: () => ({
            get: async () => ({
              docs: mockData[name]?.map(d => ({ data: () => d })) || [],
            }),
          }),
        }),
      }),
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            docs: mockData[name]?.map(d => ({ data: () => d })) || [],
          }),
        }),
      }),
    }),
  };

  // Mock bucket
  bucket = {
    name: 'mock-bucket',
    file: () => ({
      save: async () => {},
      makePublic: async () => {},
    }),
  };
}

module.exports = { admin, db, bucket, mockMode, mockData };
