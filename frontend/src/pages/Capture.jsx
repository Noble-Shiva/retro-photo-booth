import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, RotateCcw, Download, Aperture, Zap } from 'lucide-react'
import './Capture.css'

const FILTERS = [
  { id: 'vintage', name: 'Vintage', color: '#d4763a' },
  { id: 'sepia', name: 'Sepia', color: '#8b7355' },
  { id: 'polaroid', name: 'Polaroid', color: '#f0c05a' },
  { id: 'film', name: 'Film', color: '#4a9b8c' },
  { id: 'faded', name: 'Faded', color: '#c44536' },
]

function Capture() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('vintage')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState(null)
  const [flash, setFlash] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      alert('Unable to access camera. Please ensure camera permissions are granted.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      setIsStreaming(false)
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageData)
    stopCamera()
    processPhoto(imageData)
  }, [selectedFilter])

  const processPhoto = async (imageData) => {
    setIsProcessing(true)
    try {
      const blob = await fetch(imageData).then(r => r.blob())
      const formData = new FormData()
      formData.append('photo', blob, 'capture.jpg')
      formData.append('filterType', selectedFilter)

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      setProcessedImage(result.photo)
    } catch (err) {
      console.error('Process error:', err)
      // Fallback: use local image with CSS filter preview
      setProcessedImage({ imageUrl: imageData, filterType: selectedFilter })
    } finally {
      setIsProcessing(false)
    }
  }

  const retake = () => {
    setCapturedImage(null)
    setProcessedImage(null)
    startCamera()
  }

  const downloadPhoto = () => {
    if (!processedImage?.imageUrl) return

    const link = document.createElement('a')
    link.href = processedImage.imageUrl
    link.download = `retro-photo-${Date.now()}.webp`
    link.click()
  }

  return (
    <div className="capture-page">
      <div className="container">
        <motion.h1
          className="page-title font-retro"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Aperture className="title-icon" />
          Photo Booth
        </motion.h1>

        <div className="capture-container">
          <div className="viewfinder">
            {flash && <div className="flash-effect" />}

            {!isStreaming && !capturedImage && (
              <div className="start-prompt">
                <Camera size={64} />
                <p>Ready to capture</p>
                <button className="btn-retro" onClick={startCamera}>
                  Start Camera
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-feed ${!isStreaming ? 'hidden' : ''}`}
            />

            {capturedImage && !isStreaming && (
              <div className="preview">
                {isProcessing ? (
                  <div className="processing">
                    <Zap className="processing-icon" />
                    <p>Applying retro magic...</p>
                  </div>
                ) : (
                  <img
                    src={processedImage?.imageUrl || capturedImage}
                    alt="Captured"
                    className={`captured-image filter-${selectedFilter}`}
                  />
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Filter Selection */}
          <div className="filter-bar">
            <p className="filter-label font-retro">Select Filter:</p>
            <div className="filters">
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                  style={{ '--filter-color': filter.color }}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            {isStreaming && (
              <button className="btn-retro capture-btn" onClick={capturePhoto}>
                <Camera size={24} />
                Capture
              </button>
            )}

            {capturedImage && !isProcessing && (
              <>
                <button className="btn-retro btn-secondary" onClick={retake}>
                  <RotateCcw size={20} />
                  Retake
                </button>
                <button className="btn-retro" onClick={downloadPhoto}>
                  <Download size={20} />
                  Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Capture
