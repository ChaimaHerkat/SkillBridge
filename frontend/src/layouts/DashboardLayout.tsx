import React from 'react'
import Sidebar from '../components/Common/Sidebar'
import Navbar from '../components/Common/Navbar'
// import '../styles/layouts.css'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
