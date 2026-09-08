import React from 'react'
import { Link } from 'react-router-dom'
import useProjects from '../../hooks/useProjects'
import '../../styles/pages/marketplace.css'

const Marketplace: React.FC = () => {
  const { projects, isLoading, error } = useProjects()

  if (isLoading) return <div>Loading projects...</div>
  if (error) return <div>Error: {error.message}</div>

  if (!projects || projects.length === 0) return <div>No projects found.</div>

  return (
    <div className="marketplace">
      <h1>Marketplace</h1>
      <div className="projects-grid">
        {projects.map((p) => {
          // Support both snake_case (API) and camelCase (frontend types)
          const project: any = p as any
          const id = project.id || project.pk || project.project_id
          const title = project.title || project.name || 'Untitled'
          const description = project.description || project.desc || ''
          const budgetRaw = project.budget || project.budget_amount || '0'
          const budget = Number(budgetRaw)
          const currency = project.currency || project.currency_code || 'USD'
          const duration = project.duration || project.timeframe || ''

          return (
            <Link key={id} to={`/marketplace/${id}`} className="project-card">
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="project-meta">
                <span>{isNaN(budget) ? `¥ ${budgetRaw}` : `$${budget.toLocaleString()}`} {currency}</span>
                <span>{duration}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Marketplace
