import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QrCode, Users, Image, ArrowLeft, Share2, Camera, X, ZoomIn } from 'lucide-react'
import './GroupView.css'

function GroupView() {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    fetchGroup()
  }, [id])

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${id}`)
      if (response.ok) {
        const data = await response.json()
        setGroup(data)
      }
    } catch (err) {
      console.error('Fetch group error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (group?.joinUrl) {
      navigator.clipboard.writeText(group.joinUrl)
      alert('Link copied to clipboard!')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  if (loading) {
    return (
      <div className="group-view-page">
        <div className="loading">
          <div className="spinner" />
          <p>Loading group...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="group-view-page">
        <div className="empty-state">
          <p>Group not found</p>
          <Link to="/groups" className="btn-retro">
            Back to Groups
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="group-view-page">
      <div className="container">
        <Link to="/groups" className="back-link">
          <ArrowLeft size={18} />
          Back to Groups
        </Link>

        <motion.div
          className="group-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="page-title font-retro">{group.name}</h1>
          <div className="group-meta">
            <span>
              <Users size={16} />
              {group.members?.length || 0} members
            </span>
            <span>
              <Image size={16} />
              {group.photos?.length || 0} photos
            </span>
          </div>
        </motion.div>

        <div className="group-actions">
          <button
            className="btn-retro btn-secondary"
            onClick={() => setShowQR(true)}
          >
            <QrCode size={18} />
            Show QR Code
          </button>
          <button className="btn-retro" onClick={copyLink}>
            <Share2 size={18} />
            Copy Link
          </button>
          <Link to="/capture" className="btn-retro">
            <Camera size={18} />
            Add Photo
          </Link>
        </div>

        {/* Photos Grid */}
        {group.photos?.length === 0 ? (
          <div className="empty-state">
            <Image size={64} />
            <p>No photos in this group yet</p>
            <Link to="/capture" className="btn-retro">
              Capture First Photo
            </Link>
          </div>
        ) : (
          <motion.div
            className="bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {group.photos?.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="bento-item view-only"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbUrl || photo.imageUrl}
                  alt={`Photo ${index + 1}`}
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <span className="filter-badge">{photo.filterType}</span>
                  <button className="icon-btn">
                    <ZoomIn size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowQR(false)}
        >
          <motion.div
            className="qr-modal card-retro"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowQR(false)}>
              <X size={24} />
            </button>
            <h2 className="font-retro">Scan to Join</h2>
            <p>{group.name}</p>
            {group.qrCode && (
              <img src={group.qrCode} alt="QR Code" className="qr-image" />
            )}
            <p className="join-code">Code: {group.joinCode}</p>
          </motion.div>
        </motion.div>
      )}

      {/* Lightbox - View Only */}
      {selectedPhoto && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPhoto.imageUrl} alt="Preview" />
            <div className="lightbox-actions">
              <span className="filter-badge">{selectedPhoto.filterType}</span>
              <span className="view-only-badge">View Only</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default GroupView
