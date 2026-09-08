import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import projectService from '../../services/projectService'
import { useAuth } from '../../context/AuthContext'

const CreateProject: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState<number | ''>('')
  const [currency, setCurrency] = useState('USD')
  const [duration, setDuration] = useState('')
  const [skills, setSkills] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: any = {
        title,
        description,
        category,
        budget: budget === '' ? 0 : budget,
        currency,
        duration,
        skills_required: skills ? skills.split(',').map(s => s.trim()) : [],
      }

      await projectService.createProject(payload)

      // Redirect to dashboard or marketplace
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-project-page" style={{ padding: 20 }}>
      <h1>Post a Project</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <div style={{ marginBottom: 10 }}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', minHeight: 120 }} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div style={{ width: 160 }}>
            <label>Budget</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ width: 120 }}>
            <label>Currency</label>
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Duration</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Skills (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject
