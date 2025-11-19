import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Images, Download, X, ZoomIn } from 'lucide-react'
import './Gallery.css'

function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos')
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
      // Demo data for preview
      setPhotos([
        { id: '1', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=1', imageUrl: 'https://picsum.photos/800/600?grayscale&random=1', filterType: 'vintage' },
        { id: '2', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=2', imageUrl: 'https://picsum.photos/800/600?grayscale&random=2', filterType: 'sepia' },
        { id: '3', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=3', imageUrl: 'https://picsum.photos/800/600?grayscale&random=3', filterType: 'polaroid' },
        { id: '4', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=4', imageUrl: 'https://picsum.photos/800/600?grayscale&random=4', filterType: 'film' },
        { id: '5', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=5', imageUrl: 'https://picsum.photos/800/600?grayscale&random=5', filterType: 'faded' },
        { id: '6', thumbUrl: 'https://picsum.photos/300/300?grayscale&random=6', imageUrl: 'https://picsum.photos/800/600?grayscale&random=6', filterType: 'vintage' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const downloadPhoto = (photo, e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = photo.imageUrl
    link.download = `retro-${photo.id}.webp`
    link.click()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <motion.h1
          className="page-title font-retro"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Images className="title-icon" />
          Your Gallery
        </motion.h1>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="empty-state">
            <Images size={64} />
            <p>No photos yet</p>
            <p className="subtitle">Capture some retro moments!</p>
          </div>
        ) : (
          <motion.div
            className="bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="bento-item"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPhoto(photo)}
                viewport={{ once: true, margin: '-50px' }}
              >
                <img
                  src={photo.thumbUrl || photo.imageUrl}
                  alt={`Photo ${index + 1}`}
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <span className="filter-badge">{photo.filterType}</span>
                  <div className="photo-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => downloadPhoto(photo, e)}
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button className="icon-btn" title="View">
                      <ZoomIn size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={32} />
          </button>

          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPhoto.imageUrl} alt="Preview" />

            <div className="lightbox-actions">
              <span className="filter-badge">{selectedPhoto.filterType}</span>
              <button
                className="btn-retro"
                onClick={(e) => downloadPhoto(selectedPhoto, e)}
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Gallery
