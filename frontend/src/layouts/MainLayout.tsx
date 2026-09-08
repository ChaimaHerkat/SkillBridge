import React from 'react'
import Navbar from '../components/Common/Navbar'
import Footer from '../components/Common/Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const mainLayoutStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: '#fafafa'
  }

  const layoutContentStyle = {
    flex: 1,
    width: '100%'
  }

  return (
    <div style={mainLayoutStyle}>
      <Navbar />
      <main style={layoutContentStyle}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
