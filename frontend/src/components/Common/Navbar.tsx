import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navbarStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }

  const navbarContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  }

  const navbarLogoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const navbarMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    listStyle: 'none',
    margin: '0',
    padding: '0'
  }

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'opacity 0.2s'
  }

  const userAvatarStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  }

  const logoutButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  }

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <nav style={navbarStyle}>
      <div style={navbarContainerStyle}>
        <Link to="/" style={navbarLogoStyle}>
          <span>🌉</span>
          SkillBridge
        </Link>

        <div style={navbarMenuStyle}>
          <Link to="/" style={navLinkStyle}>Home</Link>
          <Link to="/marketplace" style={navLinkStyle}>Marketplace</Link>

          {isAuthenticated ? (
            <>
              <Link to="/messages" style={navLinkStyle}>Messages</Link>
              {user?.role === 'CLIENT' && (
                <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              )}
              {user?.role === 'FREELANCER' && (
                <Link to="/freelancer-dashboard" style={navLinkStyle}>Dashboard</Link>
              )}
              
              <div style={userSectionStyle}>
                <div style={userAvatarStyle}>{user?.firstName?.[0] || 'U'}</div>
                <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={{ ...navLinkStyle, backgroundColor: '#ff6b6b', padding: '8px 16px', borderRadius: '4px' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
