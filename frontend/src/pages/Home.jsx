import { Link } from 'react-router-dom'
import { Camera, Images, Users, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import './Home.css'

function Home() {
  const features = [
    {
      icon: Camera,
      title: 'Capture',
      description: 'Take photos with your camera',
      link: '/capture',
      color: 'var(--accent)',
    },
    {
      icon: Sparkles,
      title: 'Retro Filters',
      description: 'Apply vintage film effects',
      link: '/capture',
      color: 'var(--color-yellow)',
    },
    {
      icon: Images,
      title: 'Gallery',
      description: 'View and download your photos',
      link: '/gallery',
      color: 'var(--color-teal)',
    },
    {
      icon: Users,
      title: 'Groups',
      description: 'Share with friends via QR',
      link: '/groups',
      color: 'var(--color-pink)',
    },
  ]

  return (
    <div className="home">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title font-retro">
          <span className="hero-icon">📷</span>
          Retro Photo Booth
        </h1>
        <p className="hero-subtitle">
          Capture moments with vintage film aesthetics
        </p>

        <Link to="/capture" className="btn-retro hero-cta">
          Start Capturing
        </Link>
      </motion.div>

      <div className="features">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={feature.link} className="feature-card card-retro">
              <feature.icon
                size={40}
                style={{ color: feature.color }}
                className="feature-icon"
              />
              <h3 className="feature-title font-retro">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="retro-decoration">
        <div className="film-strip">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="film-hole" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
