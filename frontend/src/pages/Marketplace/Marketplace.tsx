import React from 'react'
import useProjects from '../../hooks/useProjects'
// import '../../styles/pages/marketplace.css'

const Marketplace: React.FC = () => {
  const { projects, isLoading, error } = useProjects()

  if (isLoading) return <div>Loading projects...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="marketplace">
      <h1>Marketplace</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span>${project.budget} {project.currency}</span>
              <span>{project.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
