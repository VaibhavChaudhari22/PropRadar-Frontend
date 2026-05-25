import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import TopBar from '../components/TopBar'
import FilterBar from '../components/FilterBar'
import ProjectCard from '../components/ProjectCard'
import { projectsApi } from '../utils/api'
import toast from 'react-hot-toast'
import styles from './ProjectsPage.module.css'

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  variant: '',
  minBudget: '',
  maxBudget: '',
  page: 1,
  limit: 12,
}

export default function ProjectsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [projects, setProjects] = useState([])
  const [meta, setMeta] = useState({ totalProjects: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef(null)

  const fetchProjects = useCallback(async (f) => {
    setLoading(true)
    try {
      const params = {}
      if (f.search) params.search = f.search
      if (f.location) params.location = f.location
      if (f.variant) params.variant = f.variant
      if (f.minBudget) params.minBudget = f.minBudget
      if (f.maxBudget) params.maxBudget = f.maxBudget
      params.page = f.page
      params.limit = f.limit

      const { data } = await projectsApi.getAll(params)
      setProjects(data.projects || [])
      setMeta({ totalProjects: data.totalProjects, totalPages: data.totalPages })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce filter changes
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchProjects(filters)
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [filters, fetchProjects])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleReset = () => setFilters(DEFAULT_FILTERS)

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <TopBar
        title="Projects"
        subtitle="Search and filter projects for your clients"
        actions={
          <Link to="/projects/new" className="btn btn-primary">
            <Plus size={16} strokeWidth={2.5} />
            Add Project
          </Link>
        }
      />

      <div className="page-body">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalProjects={meta.totalProjects}
        />

        {loading ? (
          <div className="page-loading">
            <div className="spinner" />
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="16" fill="#F0EDE7"/>
              <path d="M18 38L22 30L28 34L34 26L38 38H18Z" stroke="#9AA0AE" strokeWidth="1.5" fill="none"/>
              <circle cx="24" cy="22" r="4" stroke="#9AA0AE" strokeWidth="1.5" fill="none"/>
            </svg>
            <p className="font-medium">No projects found</p>
            <p className="text-sm">Try adjusting your filters or add a new project</p>
            <button className="btn btn-outline" onClick={handleReset}>
              <RefreshCw size={14} /> Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {projects.map((project, i) => (
                <div
                  key={project._id}
                  className="fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page <= 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </button>

                <div className={styles.pages}>
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - filters.page) <= 2)
                    .map(p => (
                      <button
                        key={p}
                        className={`${styles.pageBtn} ${p === filters.page ? styles.active : ''}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    ))}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page >= meta.totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
