import { Link, useLocation } from 'react-router-dom'
import { Camera, Images, Users, Home } from 'lucide-react'
import './Header.css'

function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/capture', icon: Camera, label: 'Capture' },
    { path: '/gallery', icon: Images, label: 'Gallery' },
    { path: '/groups', icon: Users, label: 'Groups' },
  ]

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">📷</span>
          <span className="logo-text font-retro">Retro Booth</span>
        </Link>

        <nav className="nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
