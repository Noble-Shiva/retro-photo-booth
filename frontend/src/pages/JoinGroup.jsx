import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CheckCircle, XCircle } from 'lucide-react'
import './JoinGroup.css'

function JoinGroup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [memberName, setMemberName] = useState('')
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGroup()
  }, [id])

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${id}`)
      if (response.ok) {
        const data = await response.json()
        setGroup(data)
      } else {
        setError('Group not found')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load group')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setJoining(true)

    try {
      const response = await fetch(`/api/groups/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName: memberName.trim() || 'Guest' }),
      })

      if (response.ok) {
        setJoined(true)
        setTimeout(() => {
          navigate(`/groups/${id}`)
        }, 2000)
      } else {
        setError('Failed to join group')
      }
    } catch (err) {
      console.error('Join error:', err)
      setError('Failed to join group')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="join-page">
        <div className="loading">
          <div className="spinner" />
          <p>Loading group...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="join-page">
        <motion.div
          className="error-state card-retro"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <XCircle size={64} className="error-icon" />
          <h2 className="font-retro">{error}</h2>
          <button className="btn-retro" onClick={() => navigate('/groups')}>
            Go to Groups
          </button>
        </motion.div>
      </div>
    )
  }

  if (joined) {
    return (
      <div className="join-page">
        <motion.div
          className="success-state card-retro"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={64} className="success-icon" />
          <h2 className="font-retro">Welcome!</h2>
          <p>You've joined {group?.name}</p>
          <p className="redirect-text">Redirecting to group...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="join-page">
      <motion.div
        className="join-card card-retro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="join-header">
          <Users size={48} className="join-icon" />
          <h1 className="font-retro">Join Group</h1>
        </div>

        <div className="group-preview">
          <h2 className="group-name font-retro">{group?.name}</h2>
          <p className="group-stats">
            {group?.photoIds?.length || 0} photos • {group?.members?.length || 0} members
          </p>
        </div>

        <form onSubmit={handleJoin} className="join-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              className="input-retro"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-retro join-btn"
            disabled={joining}
          >
            {joining ? 'Joining...' : 'Join Group'}
          </button>
        </form>

        <p className="join-note">
          You'll be able to view all photos shared in this group
        </p>
      </motion.div>
    </div>
  )
}

export default JoinGroup
