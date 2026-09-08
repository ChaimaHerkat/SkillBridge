import React from 'react'

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Go Home
      </a>
    </div>
  )
}

export default NotFound
