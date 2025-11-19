import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Plus, QrCode, Image, Calendar } from 'lucide-react'
import './Groups.css'

function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [adminName, setAdminName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])
      }
    } catch (err) {
      console.error('Fetch groups error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (e) => {
    e.preventDefault()
    if (!newGroupName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName.trim(),
          adminName: adminName.trim() || 'Admin',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGroups([data.group, ...groups])
        setNewGroupName('')
        setAdminName('')
        setShowCreate(false)
      }
    } catch (err) {
      console.error('Create group error:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="groups-page">
      <div className="container">
        <motion.h1
          className="page-title font-retro"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Users className="title-icon" />
          Photo Groups
        </motion.h1>

        <div className="groups-header">
          <p className="groups-subtitle">Share photos with friends via QR code</p>
          <button
            className="btn-retro"
            onClick={() => setShowCreate(!showCreate)}
          >
            <Plus size={18} />
            Create Group
          </button>
        </div>

        {/* Create Group Form */}
        {showCreate && (
          <motion.form
            className="create-form card-retro"
            onSubmit={createGroup}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <h3 className="font-retro">New Group</h3>
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                className="input-retro"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="My Event Photos"
                required
              />
            </div>
            <div className="form-group">
              <label>Your Name (Admin)</label>
              <input
                type="text"
                className="input-retro"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Admin"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-retro btn-secondary"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-retro"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Groups List */}
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <p>No groups yet</p>
            <p className="subtitle">Create a group to share photos!</p>
          </div>
        ) : (
          <motion.div
            className="groups-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/groups/${group.id}`} className="group-card card-retro">
                  <div className="group-icon">
                    <QrCode size={32} />
                  </div>
                  <div className="group-info">
                    <h3 className="group-name font-retro">{group.name}</h3>
                    <div className="group-stats">
                      <span>
                        <Image size={14} />
                        {group.photoCount || 0} photos
                      </span>
                      <span>
                        <Users size={14} />
                        {group.memberCount || 0} members
                      </span>
                    </div>
                  </div>
                  <div className="group-date">
                    <Calendar size={14} />
                    {new Date(group.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Groups
