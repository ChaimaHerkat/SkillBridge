import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/components/sidebar.css'

interface SidebarLink {
  path: string
  label: string
  icon: string
}

const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  const dashboardLinks: Record<string, SidebarLink[]> = {
    client: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: '📊',
      },
      {
        path: '/dashboard/projects',
        label: 'My Projects',
        icon: '📋',
      },
      {
        path: '/dashboard/create-project',
        label: 'Create Project',
        icon: '➕',
      },
      {
        path: '/dashboard/applicants',
        label: 'Applicants',
        icon: '👥',
      },
      {
        path: '/messages',
        label: 'Messages',
        icon: '💬',
      },
    ],

    freelancer: [
      {
       path: '/dashboard',
       label: 'Dashboard',
       icon: '📊',
      }, 
      {
       path: '/dashboard/my-projects',
       label: 'My Projects',
       icon: '💼',
      },
      {
       path: '/dashboard/proposals',
       label: 'My Proposals',
       icon: '📨',
      },
      {
       path: '/dashboard/saved-jobs',
       label: 'Saved Jobs',
       icon: '🔖',
      },
      {
       path: '/messages',
       label: 'Messages',
       icon: '💬',
      },
    ],

    admin: [
      {
        path: '/admin',
        label: 'Dashboard',
        icon: '📊',
      },
      {
        path: '/admin/users',
        label: 'Users',
        icon: '👥',
      },
      {
        path: '/admin/projects',
        label: 'Projects',
        icon: '📋',
      },
      {
        path: '/admin/categories',
        label: 'Categories',
        icon: '🏷️',
      },
      {
        path: '/admin/reports',
        label: 'Reports',
        icon: '📈',
      },
    ],
  }

  const role = user?.role?.toLowerCase() || ''
  const links = dashboardLinks[role] || []

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>{user?.role?.toUpperCase()} PANEL</h3>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`sidebar-link ${
                  location.pathname === link.path
                    ? 'active'
                    : ''
                }`}
              >
                <span className="link-icon">
                  {link.icon}
                </span>

                <span className="link-label">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar