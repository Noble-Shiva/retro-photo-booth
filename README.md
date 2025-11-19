# Retro Photo Booth

A vintage-styled photo booth web application with retro filters, group sharing via QR codes, and a beautiful bento grid gallery.

## Features

- **Camera Capture**: Take photos using your device camera
- **Retro Filters**: Apply vintage, sepia, polaroid, film, and faded effects
- **Photo Gallery**: View photos in a 3-column bento grid with scroll animations
- **Lightbox Preview**: Click any photo for a fullscreen preview
- **Download**: Save processed photos as WebP
- **Groups**: Create photo groups and share via QR codes
- **QR Code Sharing**: Scan QR codes to join groups and view shared photos (view-only)

## Tech Stack

### Frontend
- React 18 + Vite
- Framer Motion (animations)
- React Router (navigation)
- Lucide React (icons)
- Custom retro CSS with VT323 & Press Start 2P fonts

### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore (database)
- Firebase Storage (images)
- Sharp (image processing)
- QRCode (QR generation)

## Setup

### Prerequisites
- Node.js 18+
- Firebase project with Firestore and Storage enabled

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

3. Configure Firebase credentials in `.env`:
   ```
   PORT=3001
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## API Endpoints

### Photos
- `POST /api/photos/upload` - Upload photo with retro filter
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get single photo

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group with photos
- `POST /api/groups/:id/join` - Join a group
- `GET /api/groups/:id/qr` - Get group QR code

## Project Structure

```
retro-photo-booth/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global CSS
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/        # Firebase config
│   │   ├── routes/        # API routes
│   │   ├── services/      # Image & QR services
│   │   └── index.js       # Server entry
│   └── package.json
└── mobile/                # Future mobile app
```

## Retro Design Elements

- **Fonts**: VT323 (headers), Courier Prime (body), Press Start 2P (pixel)
- **Colors**: Cream, brown, orange, teal, with dark backgrounds
- **UI**: Bordered cards, box shadows, rounded corners
- **Animations**: Scroll-triggered fade-ins, spring animations

## License

MIT
