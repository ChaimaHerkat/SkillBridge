import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  const footerStyle = {
    backgroundColor: '#2d3436',
    color: 'white',
    padding: '40px 20px 20px',
    marginTop: '60px'
  }

  const footerContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '30px'
  }

  const footerSectionStyle = {
    lineHeight: '1.8'
  }

  const footerHeadingStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px'
  }

  const footerListStyle = {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  }

  const footerLinkStyle = {
    color: '#b2bec3',
    textDecoration: 'none',
    transition: 'color 0.2s'
  }

  const footerBottomStyle = {
    textAlign: 'center' as const,
    borderTop: '1px solid #444',
    paddingTop: '20px',
    color: '#b2bec3'
  }

  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div style={footerSectionStyle}>
          <h4 style={footerHeadingStyle}>About SkillBridge</h4>
          <ul style={footerListStyle}>
            <li><Link to="/" style={footerLinkStyle}>About Us</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Blog</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Press</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Careers</Link></li>
          </ul>
        </div>

        <div style={footerSectionStyle}>
          <h4 style={footerHeadingStyle}>For Clients</h4>
          <ul style={footerListStyle}>
            <li><Link to="/marketplace" style={footerLinkStyle}>Find Talent</Link></li>
            <li><Link to="/" style={footerLinkStyle}>How it Works</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Pricing</Link></li>
          </ul>
        </div>

        <div style={footerSectionStyle}>
          <h4 style={footerHeadingStyle}>For Freelancers</h4>
          <ul style={footerListStyle}>
            <li><Link to="/freelancer-dashboard" style={footerLinkStyle}>Find Work</Link></li>
            <li><Link to="/" style={footerLinkStyle}>How it Works</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Earnings</Link></li>
          </ul>
        </div>

        <div style={footerSectionStyle}>
          <h4 style={footerHeadingStyle}>Support</h4>
          <ul style={footerListStyle}>
            <li><Link to="/" style={footerLinkStyle}>Help & Support</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Trust & Safety</Link></li>
            <li><Link to="/" style={footerLinkStyle}>Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div style={footerBottomStyle}>
        <p>&copy; 2026 SkillBridge — connecting talent with opportunity</p>
      </div>
    </footer>
  )
}

export default Footer
